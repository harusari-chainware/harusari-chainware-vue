<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/useAuthStore.js'
import { setAuthStore } from '@/api/axios.js'

// ✅ 인증 store 주입
const authStore = useAuthStore()
setAuthStore(authStore)
console.log('🔐 AUTH HEADER:', authStore?.authority)
import {
  fetchInventories,
  fetchInventoryDetail,
  fetchMyWarehouseId
} from '@/features/warehouse/api.js'

import InventoryWarehouseFilter from '@/features/warehouse/components/InventoryWarehouseFilter.vue'
import InventoryTable from '@/features/warehouse/components/InventoryTable.vue'
import InventoryDetailModal from '@/features/warehouse/components/InventoryDetailModal.vue'

import ListFiltersSection from '@/components/layout/listview/ListFiltersSection.vue'
import ListTopActions from '@/components/layout/listview/ListTopActions.vue'
import ListTableSection from '@/components/layout/listview/ListTableSection.vue'
import Pagination from '@/components/common/Pagination.vue'

const inventories = ref([])
const showModal = ref(false)
const detailData = ref({})
const page = ref(1)
const totalItems = ref(0)
const lastFilters = ref({})
const warehouseId = ref(null)
const isLoaded = ref(false)

const pageSize = 10

const initialFilters = {
  productName: '',
  topCategoryId: '',
  categoryId: '',
  includeZero: false
}

const onSearch = async (filters) => {
  lastFilters.value = { ...filters }

  const { data } = await fetchInventories({
    ...filters,
    warehouseId: warehouseId.value,
    page: page.value - 1,
    size: pageSize
  })

  inventories.value = data.data?.contents ?? []
  totalItems.value = data.data?.totalElements ?? 0
}

const onShowDetail = async (id) => {
  const { data } = await fetchInventoryDetail(id)
  const raw = data.data

  detailData.value = {
    warehouse: {
      name: raw.warehouse.warehouseName,
      address: `${raw.warehouse.warehouseAddress.addressRoad} ${raw.warehouse.warehouseAddress.addressDetail}`,
      contact: raw.warehouse.contact || '-',
    },
    product: {
      name: raw.product.productName,
      code: raw.product.productCode,
      category: raw.product.categoryName,
      unit: raw.product.unitSpec || '-',
    },
    inventory: {
      quantity: raw.inventory.quantity,
      reservedQuantity: raw.inventory.reservedQuantity,
      modifiedAt: null,
    },
    recentInbounds: raw.inboundHistories.slice(0, 5).map(item => ({
      date: item.inboundedAt,
      quantity: item.quantity,
      manager: item.vendorName,
      note: item.purchaseOrderCode,
    })),
    recentOutbounds: raw.outboundHistories.slice(0, 5).map(item => ({
      date: item.requestedAt,
      quantity: item.quantity,
      manager: item.carrier,
      destination: item.franchiseName,
    }))
  }

  showModal.value = true
}

const onPageChange = async (newPage) => {
  page.value = newPage
  await onSearch(lastFilters.value)
}

onMounted(async () => {
  const { data } = await fetchMyWarehouseId()
  warehouseId.value = data.data
  isLoaded.value = true
  await onSearch(initialFilters)
})
</script>

<template>
  <main v-if="isLoaded">
    <section class="page-header">
      <h1 class="page-title">내 창고 재고 조회</h1>
      <p class="page-description">내가 관리 중인 창고의 보유 재고를 조회할 수 있습니다.</p>
    </section>

    <ListFiltersSection>
      <InventoryWarehouseFilter @search="onSearch" />
    </ListFiltersSection>

    <ListTopActions>
      <template #left />
      <template #right />
    </ListTopActions>

    <ListTableSection>
      <InventoryTable :items="inventories" @detail="onShowDetail" />
    </ListTableSection>

    <Pagination
        v-model="page"
        :total-items="totalItems"
        :items-per-page="pageSize"
        @update:modelValue="onPageChange"
    />

    <InventoryDetailModal
        :show="showModal"
        :data="detailData"
        @close="showModal = false"
    />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 1rem;
}
.page-title {
  font-size: var(--font-page-title-large);
  color: var(--color-gray-900);
  margin-bottom: 6px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
}
.page-description {
  color: var(--color-gray-600);
  font-size: var(--font-page-description);
}
</style>
