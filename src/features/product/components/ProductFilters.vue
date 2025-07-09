<template>
  <div class="filters-container-vertical">
    <div class="filter-row">
      <FilterSelect
          label="상위 카테고리명"
          v-model="filters.topCategoryName"
          :options="topCategoryOptionsName"
      />
      <FilterSelect
          label="카테고리명"
          v-model="filters.categoryName"
          :options="categoryOptionsName"
      />
    </div>
    <div class="filter-row">
      <FilterSelect
          label="보관상태"
          v-model="filters.storeType"
          :options="storeTypeOptions"
      />
      <FilterSelect
          label="제품상태"
          v-model="filters.productStatus"
          :options="productStatusOptions"
      />
    </div>
    <div class="filter-row align-end">
      <div class="filter-input-wrap">
        <label class="filter-label">제품명</label>
        <input
            class="filter-input"
            v-model="filters.productName"
            placeholder="제품명을 입력하세요"
            type="text"
        />
      </div>
      <div class="filter-input-wrap">
        <label class="filter-label">등록일시</label>
        <input
            class="filter-input"
            v-model="filters.createdAt"
            type="date"
        />
      </div>
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

const props = defineProps({
  topCategories: { type: Array, required: true }  // fetchAllTopCategories() 결과!
})
const emit = defineEmits(['apply', 'reset'])

// 필터 상태
const filters = reactive({
  topCategoryName: '',
  categoryName: '',
  storeType: '',
  productStatus: '',
  productName: '',
  createdAt: ''
})

// 드롭다운 옵션
// const topCategoryOptions = ref([{ label: '전체', value: '' }])
// const categoryOptions = ref([{ label: '전체', value: '' }])
const topCategories = ref([]) // 전체(상위+하위) 카테고리(카테고리 드롭다운에 사용)
const topCategoryListOnly = ref([]) // 상위만 (상위 카테고리 드롭다운 전용)
// const topCategoryOptions = ref([{ label: '전체', value: '' }])
// const categoryOptions = ref([{ label: '전체', value: '' }])
const categoryOptionsName = ref([{ label: '전체', value: '' }])
const topCategoryOptionsName = ref([{ label: '전체', value: '' }])

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

// ENUM 옵션
const storeTypeOptions = [
  { label: 'ROOM_TEMPERATURE', value: 'ROOM_TEMPERATURE' },
  { label: 'CHILLED', value: 'CHILLED' },
  { label: 'FROZEN', value: 'FROZEN' }
]
const productStatusOptions = [
  { label: '활성', value: 'ACTIVE' },
  { label: '비활성', value: 'INACTIVE' }
]

// 필터 적용
const applyFilters = () => {
  console.log('[applyFilters] 필터 값:', filters)
  emit('apply', { ...filters })
}

// 초기화
const resetFilters = () => {
  Object.assign(filters, {
    topCategoryId: '',
    categoryId: '',
    storeType: '',
    productStatus: '',
    productName: '',
    createdAt: ''
  })
  categoryOptions.value = [{ label: '전체', value: '' }]
  emit('reset', {})
}
</script>

<style scoped>
.filters-container-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 2.5rem;
  padding: 0 3rem 0 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;;
}
.filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4개 항목 똑같이 */
  gap: 40px;
  align-items: flex-end;
  width: 100%;
}

.align-end {
  align-items: flex-end;
}
.filter-input-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.filter-label {
  font-weight: 450;
  color: var(--color-gray-900, #222);
  margin-bottom: 5px;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
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

</style>
