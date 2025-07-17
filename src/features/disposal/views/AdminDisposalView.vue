<script setup>
import { ref, onMounted, watch } from 'vue'
import DisposalTable from '@/features/disposal/components/DisposalTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import {
  searchDisposalsAPI,
  fetchAllFranchises,
  fetchAllWarehouses,
  searchDisposalProductsAPI
} from '@/features/disposal/api.js'
import { useAuthStore } from '@/features/auth/useAuthStore'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'

const auth = useAuthStore()
const disposals = ref([])
const page = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const filters = ref({
  locationType: 'all',
  locationId: '',
  searchKeyword: '',
  franchiseName: '',
  warehouseName: '',
  productName: '',
  disposalType: '',
  dateRange: { start: '', end: '' }
})

const franchises = ref([])
const warehouses = ref([])

watch(
    () => filters.value.locationType,
    async (val) => {
      filters.value.searchKeyword = ''
      filters.value.locationId = ''
      if (val === 'franchise') {
        franchises.value = await fetchAllFranchises()
      } else if (val === 'warehouse') {
        warehouses.value = await fetchAllWarehouses()
      }
    },
    { immediate: true }
)

watch(
    () => filters.value.searchKeyword,
    (val) => {
      if (filters.value.locationType === 'all') return
      const list = filters.value.locationType === 'franchise' ? franchises.value : warehouses.value
      const match = list.find(i => i.name.includes(val))
      filters.value.locationId = match ? match.id : ''
    }
)

async function loadDisposals() {
  try {
    const { dateRange, ...rest } = filters.value

    const rawParams = {
      ...rest,
      startDate: dateRange.start,
      endDate: dateRange.end,
      page: page.value,
      size: itemsPerPage
    }

    const cleanedParams = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) => v !== '')
    )

    if (filters.value.locationType === 'franchise') {
      cleanedParams.franchiseName =
          franchises.value.find(f => f.id === Number(filters.value.locationId))?.name || ''
      delete cleanedParams.warehouseName
    } else if (filters.value.locationType === 'warehouse') {
      cleanedParams.warehouseName =
          warehouses.value.find(w => w.id === Number(filters.value.locationId))?.name || ''
      delete cleanedParams.franchiseName
    } else {
      delete cleanedParams.franchiseName
      delete cleanedParams.warehouseName
    }

    const response = await searchDisposalsAPI(cleanedParams)
    disposals.value = response.data?.data?.items || []
    totalItems.value = response.data?.data?.pagination?.totalItems || 0
  } catch (error) {
    console.error('폐기 내역 조회 실패:', error)
  }
}

function search() {
  page.value = 1
  loadDisposals()
}

function reset() {
  page.value = 1
  filters.value = {
    locationType: 'all',
    locationId: '',
    searchKeyword: '',
    franchiseName: '',
    warehouseName: '',
    productName: '',
    disposalType: '',
    dateRange: { start: '', end: '' }
  }
  productKeyword.value = ''
  productSuggestions.value = []
  isProductSelected.value = false
  loadDisposals()
}

const productKeyword = ref('')
const productSuggestions = ref([])
const isProductSelected = ref(false)

watch(productKeyword, async (val) => {
  isProductSelected.value = false

  if (val.trim().length < 2 || !auth.authority) {
    productSuggestions.value = []
    return
  }

  try {
    const payload = {
      keyword: val.trim(),
      type:
          auth.authority === 'WAREHOUSE_MANAGER'
              ? 'WAREHOUSE'
              : auth.authority === 'FRANCHISE_MANAGER'
                  ? 'FRANCHISE'
                  : 'ALL'
    }

    const res = await searchDisposalProductsAPI(payload)
    const list = res?.data?.data
    productSuggestions.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.error('상품 검색 실패:', e)
    productSuggestions.value = []
  }
})

function selectProduct(product) {
  productKeyword.value = product.productName
  filters.value.productName = product.productName
  productSuggestions.value = []
  isProductSelected.value = true
}

onMounted(() => {
  console.log(' 사용자 권한:', auth.authority)
  loadDisposals()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="filter-container">
      <h2 class="filter-title">검색 필터</h2>
      <form class="filter-form" @submit.prevent="search">
        <div class="form-row">
          <div class="form-group">
            <select class="form-select" v-model="filters.locationType">
              <option value="all">전체</option>
              <option value="franchise">가맹점</option>
              <option value="warehouse">창고</option>
            </select>
          </div>

          <div class="form-group">
            <select
                class="form-select"
                v-model="filters.locationId"
                :disabled="filters.locationType === 'all'"
            >
              <option disabled value="">선택</option>
              <option
                  v-for="item in filters.locationType === 'franchise' ? franchises : warehouses"
                  :key="item.id"
                  :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <input
                class="form-control"
                placeholder="이름 검색"
                v-model="filters.searchKeyword"
                :disabled="filters.locationType === 'all'"
            />
          </div>
        </div>

        <div class="form-row product-search-wrapper">
          <div class="form-group" style="position: relative;">
            <input
                class="form-control"
                placeholder="상품명 입력"
                v-model="productKeyword"
            />
            <ul
                v-if="productKeyword.length >= 2 && productSuggestions.length > 0 && !isProductSelected"
                class="product-suggestion-list"
            >
              <li
                  v-for="item in productSuggestions"
                  :key="item.productId"
                  @mousedown.prevent="selectProduct(item)"
              >
                {{ item.productName }} <span class="code">({{ item.productCode }})</span>
              </li>
            </ul>
            <ul
                v-else-if="productKeyword.length >= 2 && !isProductSelected"
                class="product-suggestion-list"
            >
              <li class="empty">💡 검색된 상품이 없습니다</li>
            </ul>
          </div>

          <div class="form-group">
            <select class="form-select" v-model="filters.disposalType">
              <option value="">전체</option>
              <option value="NORMAL">일반 폐기</option>
              <option value="RETURN">반품 폐기</option>
            </select>
          </div>

          <div class="form-group">
            <FilterDateRange v-model="filters.dateRange" />
          </div>
        </div>

        <div class="filter-actions">
          <button type="button" class="btn btn-secondary" @click="reset">초기화</button>
          <button type="submit" class="btn btn-primary">검색</button>
        </div>
      </form>
    </div>

    <DisposalTable :items="disposals" />
    <Pagination
        v-model="page"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        @update:modelValue="loadDisposals"
    />
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: #f9fafb;
  padding: 24px;
  min-height: 100vh;
}
.filter-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}
.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}
.filter-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.form-group {
  flex: 1;
  min-width: 200px;
}
.form-control,
.form-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #1f2937;
  box-sizing: border-box;
}
.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.btn-primary {
  background-color: rgb(58, 174, 216);
  color: white;
}
.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}
.product-suggestion-list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  padding: 0;
  list-style: none;
}
.product-suggestion-list li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}
.product-suggestion-list li:hover {
  background-color: #f3f4f6;
}
.product-suggestion-list .empty {
  color: #999;
}
.code {
  color: #888;
  font-size: 12px;
}
.form-group :deep(.filter-group) {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}
.form-group :deep(.filter-label) {
  display: none;
}
</style>
