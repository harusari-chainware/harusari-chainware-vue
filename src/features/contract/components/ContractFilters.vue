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
        <FilterButtons @reset="resetFilters" @apply="applyFilters" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'
import {fetchAllListTopCategories, fetchAllTopCategories} from '@/features/category/api.js'
import FilterDate from '@/components/common/filters/FilterDate.vue'

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
  console.log('[applyFilters] 필터 값:', filters)
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
  categoryOptions.value = [{ label: '전체', value: '' }]
  emit('reset', {})
}

</script>

<style scoped>
.filters-container {
  background: #f7fafd;
  padding: 32px 24px 16px 24px;
  border-radius: 14px;
  margin-bottom: 30px;
}

/* 반응형 그리드 */
.filters-container {
  background: #f7fafd;
  padding: 32px 24px 16px 24px;
  border-radius: 14px;
  margin-bottom: 30px;
  overflow-x: auto;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 필드 개수에 맞게 숫자 맞추세요 */
  gap: 32px;
  align-items: flex-end;
  min-width: 1100px;
}

.filter-row-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
  padding-right: 6px;
  /* min-width: 1100px; // 필요하면 추가 */
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

@media (max-width: 1024px) {
  .filter-row {
    grid-template-columns: repeat(2, 1fr);  /* 태블릿: 2칸 */
    gap: 24px;
  }
}
@media (max-width: 600px) {
  .filters-container {
    padding: 16px 6px 8px 6px;
    border-radius: 8px;
  }
  .filter-row {
    grid-template-columns: 1fr;   /* 모바일: 1칸 */
    gap: 14px;
  }
}
.align-end {
  align-items: flex-end;
}

.filter-input {
  border: 1px solid #e4e7ee;
  border-radius: 8px;
  background: #fafbfc;
  height: 38px;
  font-size: 1rem;
  padding: 0 13px;
  color: var(--color-gray-900, #222);
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
.filter-label-input {
  display: flex;
  flex-direction: column;
  min-width: 140px;
}
.label {
  font-weight: 500;
  margin-bottom: 5px;
}
.input {
  border: 1px solid #e4e7ee;
  border-radius: 8px;
  background: #fafbfc;
  height: 38px;
  font-size: 1rem;
  padding: 0 13px;
  color: #222;
}
</style>
