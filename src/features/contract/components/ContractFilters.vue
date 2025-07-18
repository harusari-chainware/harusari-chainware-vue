<template>
  <div class="filters-container">
    <div class="filter-row">
      <div class="filter-label-input">
        <label class="label">제품명</label>
        <input v-model="filters.productName" class="input" placeholder="제품명" type="text" />
      </div>
      <div class="filter-label-input">
        <label class="label">상위 카테고리명</label>
        <FilterSelect v-model="filters.topCategoryName" :options="topCategoryOptionsName" />
      </div>
      <div class="filter-label-input">
        <label class="label">카테고리명</label>
        <FilterSelect v-model="filters.categoryName" :options="categoryOptionsName" />
      </div>
      <div class="filter-label-input">
        <label class="label">거래처명</label>
        <input v-model="filters.vendorName" class="input" placeholder="거래처명" type="text" />
      </div>
      <div class="filter-label-input">
        <label class="label">계약 상태</label>
        <FilterSelect v-model="filters.contractStatus" :options="contractStatusOptions" />
      </div>
      <div class="filter-label-input">
        <label class="label">거래처 유형</label>
        <FilterSelect v-model="filters.vendorType" :options="vendorTypeOptions" />
      </div>
      <div class="filter-label-input">
        <FilterDate
            label="계약 기준일"
            v-model="filters.contractDate"
        />
      </div>
    </div>
    <div class="filter-row filter-row-buttons">
      <div class="filter-buttons">
        <ContractFilterButtons @reset="resetFilters" @apply="applyFilters" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, watch} from 'vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import {fetchAllListTopCategories, fetchAllTopCategories} from '@/features/category/api.js'
import FilterDate from '@/components/common/filters/FilterDate.vue'
import ContractFilterButtons from "@/features/contract/components/ContractFilterButtons.vue";

const topCategories = ref([]) // 전체(상위+하위) 카테고리(카테고리 드롭다운에 사용)
const topCategoryListOnly = ref([]) // 상위만 (상위 카테고리 드롭다운 전용)
const categoryOptionsName = ref([{ label: '전체', value: '' }])
const topCategoryOptionsName = ref([{ label: '전체', value: '' }])

const props = defineProps({
  topCategories: { type: Array, default: () => [] },
  // topCategories: { type: Array, required: true },
  vendorTypeOptions: { type: Array, default: () => [] },
  contractStatusOptions: { type: Array, default: () => [] }
})
const emit = defineEmits(['apply', 'reset'])
const filters = reactive({
  productName: '',
  vendorName: '',
  contractDate: '',
  categoryName: '',
  topCategoryName: '',
  contractStatus: '',
  vendorType: ''
})

onMounted(async () => {
  // 1. 상위 카테고리(이름/ID만)
  const resTop = await fetchAllListTopCategories()
  topCategoryListOnly.value = resTop.data.data ?? []
  topCategoryOptionsName.value = [
    ...topCategoryListOnly.value.map(tc => ({
      label: tc.topCategoryName,
      value: top.topCategoryName
    }))
  ]
  // 2. 전체 카테고리(하위까지)
  const resFull = await fetchAllTopCategories()
  topCategories.value = resFull.data.data.topCategories ?? []
})

watch(() => filters.topCategoryName, newTopName  => {
  filters.categoryName  = ''
  const found = topCategories.value.find(tc => String(tc.topCategoryName ) === newTopName)
  if (found && found.categories && found.categories.length > 0) {
    categoryOptionsName.value = [
      ...found.categories.map(cat => ({
        label: cat.categoryName,
        value: cat.categoryName
      }))
    ]
  } else {
    categoryOptionsName.value = [{ label: '전체', value: '' }]
  }
}, { immediate: true })

const getCategoryName = (categoryId) => {
  for (const top of topCategories.value) {
    const found = (top.categories || []).find(cat => cat.categoryId === categoryId)
    if (found) return found.categoryName
  }
  return ''
}

// 필터 적용
const applyFilters = () => {
  emit('apply', { ...filters })
}

// const resetFilters = () => {
//   Object.keys(filters).forEach(k => filters[k] = '')
//   emit('reset')
// }

const resetFilters = () => {
  Object.assign(filters, {
    productName: '',
    vendorName: '',
    contractDate: '',
    categoryName: '',
    topCategoryName: '',
    contractStatus: '',
    vendorType: ''
  })
  categoryOptionsName.value = [{ label: '전체', value: '' }]

  // 필터 초기화 후 전체 목록 요청
  nextTick(() => {
    emit('apply', { ...filters })
  })
}

</script>

<style scoped>
.filters-container input,
.filters-container select {
  border: 1px solid #e4e7ee;
  border-radius: 8px;
  background: #fafbfc;
  height: 38px;
  font-size: 1rem;
  padding: 0 13px;
  color: #222;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* PC: 7칸 */
  gap: 32px;
  align-items: flex-end;
  width: 100%;
}

.filter-label-input {
  display: flex;
  flex-direction: column;
  min-width: 0;    /* 겹침 방지용! */
  width: 100%;     /* 부모 그리드 안에서 꽉 채움 */
}

.input,
select,
.filter-label-input > * {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.label {
  font-weight: 500;
  margin-bottom: 5px;
}

/* 버튼 영역 */
.filter-row-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
  padding-right: 6px;
}

.filter-buttons {
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.search-btn, .reset-btn {
  background: #59a6ce;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 28px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-left: 12px;
}
.reset-btn { background: #bfc7d3; color: #25435c; }

/* 반응형: 칸 수 점진적으로 줄이기 */
@media (max-width: 1200px) {
  .filter-row {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
}
@media (max-width: 900px) {
  .filter-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
@media (max-width: 600px) {
  .filters-container {
    padding: 16px 6px 8px 6px;
    border-radius: 8px;
  }
  .filter-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.filter-label[data-v-6c98926b] {
  font-weight: 600;
  font-size: 16px;                  /* 폰트 사이즈 16px */
  color: var(--color-gray-800);
  margin-bottom: 12px;
}

</style>
