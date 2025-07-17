<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import {
  fetchAllWarehouses,
  fetchAllListTopCategories,
  fetchSubCategories
} from '@/features/warehouse/api.js'

const emit = defineEmits(['search'])

const filters = reactive({
  productName: '',
  warehouseName: '',
  warehouseAddress: '',
  topCategoryId: '',
  categoryId: '',
  includeZero: false
})

const warehouses = ref([])
const topCategories = ref([]) // [{ topCategoryId, topCategoryName }]
const subCategories = ref([]) // [{ categoryId, categoryName }]

// ✅ 초기 데이터 로드
onMounted(async () => {
  const [warehouseRes, topCategoryRes] = await Promise.all([
    fetchAllWarehouses(),
    fetchAllListTopCategories()
  ])
  warehouses.value = warehouseRes ?? []
  topCategories.value = Array.isArray(topCategoryRes) ? topCategoryRes : []
})

// ✅ 상위 카테고리 선택 시 하위 카테고리 동적 fetch
watch(() => filters.topCategoryId, async (newTopId) => {
  filters.categoryId = ''
  subCategories.value = []

  if (!newTopId && newTopId !== 0) return

  const selectedTop = topCategories.value
      .filter(tc => tc && typeof tc === 'object' && tc.topCategoryId != null)
      .find(top => top.topCategoryId === newTopId)

  if (!selectedTop?.topCategoryName) return

  try {
    const sub = await fetchSubCategories(selectedTop.topCategoryName)
    subCategories.value = sub ?? []
  } catch (e) {
    console.warn('하위 카테고리 로딩 실패:', e)
    subCategories.value = []
  }
})

// ✅ 검색
const onSearch = () => {
  emit('search', {
    ...filters,
    topCategoryId: filters.topCategoryId || '',
    categoryId: filters.categoryId || ''
  })
}

// ✅ 초기화
const onReset = () => {
  filters.productName = ''
  filters.warehouseName = ''
  filters.warehouseAddress = ''
  filters.topCategoryId = ''
  filters.categoryId = ''
  filters.includeZero = false
  subCategories.value = []
  emit('search', { ...filters })
}
</script>

<template>
  <form class="filter-bar" @submit.prevent="onSearch">
    <!-- 제품명 -->
    <input v-model="filters.productName" placeholder="제품명" />

    <!-- 창고 -->
    <select v-model="filters.warehouseName">
      <option value="">전체 창고</option>
      <option v-for="w in warehouses" :key="w.id" :value="w.name">
        {{ w.name }}
      </option>
    </select>

    <!-- 상위 카테고리 -->
    <select v-model.number="filters.topCategoryId">
      <option value="">상위 카테고리</option>
      <option
          v-for="top in topCategories"
          :key="top.topCategoryId"
          :value="top.topCategoryId"
      >
        {{ top.topCategoryName }}
      </option>
    </select>

    <!-- 하위 카테고리 -->
    <select v-model="filters.categoryId" :disabled="subCategories.length === 0">
      <option value="">하위 카테고리</option>
      <option
          v-for="cat in subCategories"
          :key="cat.categoryId"
          :value="cat.categoryId"
      >
        {{ cat.categoryName }}
      </option>
    </select>

    <!-- 수량 0 포함 -->
    <label class="checkbox">
      <input type="checkbox" v-model="filters.includeZero" />
      <span>수량 0 포함</span>
    </label>

    <button type="button" class="reset" @click="onReset">초기화</button>
    <button type="submit" class="search">검색</button>
  </form>
</template>

<style scoped>
.filter-bar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
  width: 100%;
}

.filter-bar input,
.filter-bar select,
.filter-bar button {
  height: 36px;
  padding: 0 0.75rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100%;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  white-space: nowrap;
  padding-left: 0.25rem;
}

.checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.reset {
  background-color: #f4f4f4;
  color: #444;
  border: 1px solid #ddd;
}

.search {
  background-color: rgb(58, 174, 216);
  color: white;
}
</style>
