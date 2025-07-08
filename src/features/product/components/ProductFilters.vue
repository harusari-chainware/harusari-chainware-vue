productfilters

<template>
  <div class="filters-container-vertical">
    <div class="filter-row">
      <FilterSelect
          label="상위 카테고리명"
          v-model="filters.topCategoryId"
          :options="topCategoryOptions"
      />
      <FilterSelect
          label="카테고리명"
          v-model="filters.categoryId"
          :options="categoryOptions"
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
import {fetchAllListTopCategories, fetchAllTopCategories} from "@/api/categoryApi.js";

const props = defineProps({
  topCategories: { type: Array, required: true }  // fetchAllTopCategories() 결과!
})
const emit = defineEmits(['apply', 'reset'])

// 필터 상태
const filters = reactive({
  topCategoryId: '',
  categoryId: '',
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
const topCategoryOptions = ref([{ label: '전체', value: '' }])
const categoryOptions = ref([{ label: '전체', value: '' }])

onMounted(async () => {
  // 1. 상위 카테고리(이름/ID만)
  const resTop = await fetchAllListTopCategories()
  topCategoryListOnly.value = resTop.data.data ?? []
  topCategoryOptions.value = [
    ...topCategoryListOnly.value.map(tc => ({
      label: tc.topCategoryName,
      value: String(tc.topCategoryId)
    }))
  ]
  // 2. 전체 카테고리(하위까지)
  const resFull = await fetchAllTopCategories()
  topCategories.value = resFull.data.data.topCategories ?? []
})

watch(() => filters.topCategoryId, newTopId => {
  filters.categoryId = ''
  const found = topCategories.value.find(tc => String(tc.topCategoryId) === String(newTopId))
  if (found && found.categories && found.categories.length > 0) {
    categoryOptions.value = [
      ...found.categories.map(cat => ({
        label: cat.categoryName,
        value: String(cat.categoryId)
      }))
    ]
  } else {
    categoryOptions.value = [{ label: '전체', value: '' }]
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
  gap: 12px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px 0 var(--color-box-shadow, #e6edf7);
  margin-bottom: 2.5rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  max-width: 920px;
  margin-left: auto;
  margin-right: auto;
}
.filter-row {
  display: flex;
  flex-direction: row;
  gap: 28px;
  align-items: flex-end;
}
.align-end {
  align-items: flex-end;
}
.filter-input-wrap {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  max-width: 260px;
}
.filter-label {
  font-weight: 700;
  color: var(--color-gray-900, #222);
  margin-bottom: 7px;
  font-size: 1.08rem;
}
.filter-input {
  border: 1px solid var(--color-gray-200, #dbe4ea);
  border-radius: 8px;
  background: var(--color-bg-light, #f8fafc);
  height: 38px;
  font-size: 1rem;
  padding: 0 14px;
  color: var(--color-gray-900, #222);
}
.filter-buttons {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
</style>
