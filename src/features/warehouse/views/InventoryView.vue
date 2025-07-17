<script setup>
import { ref, onMounted } from 'vue'
import {
  fetchInventories,
  fetchInventoryDetail
} from '@/features/warehouse/api.js'

import InventoryFilter from '@/features/warehouse/components/InventoryFilter.vue'
import InventoryTable from '@/features/warehouse/components/InventoryTable.vue'
import InventoryDetailModal from '@/features/warehouse/components/InventoryDetailModal.vue'

import ListFiltersSection from '@/components/layout/listview/ListFiltersSection.vue'
import ListTopActions from '@/components/layout/listview/ListTopActions.vue'
import ListTableSection from '@/components/layout/listview/ListTableSection.vue'
import Pagination from '@/components/common/Pagination.vue'

// ✅ 상태 관리
const inventories = ref([])
const showModal = ref(false)
const detailData = ref({})
const page = ref(1)
const totalItems = ref(0)
const lastFilters = ref({}) // 마지막 검색 조건 저장

const pageSize = 10

// ✅ 필터 초기값
const initialFilters = {
  productName: '',
  warehouseName: '',
  warehouseAddress: '',
  topCategoryId: '',
  categoryId: '',
  includeZero: false
}

// ✅ 검색
const onSearch = async (filters) => {
  lastFilters.value = { ...filters } // filters 기억

  const { data } = await fetchInventories({
    ...filters,
    page: page.value - 1,
    size: pageSize
  })

  inventories.value = data.data?.contents ?? []
  totalItems.value = data.data?.totalElements ?? 0
}

// ✅ 상세 조회
const onShowDetail = async (id) => {
  const { data } = await fetchInventoryDetail(id)
  const raw = data.data

  detailData.value = {
    warehouse: {
      name: raw.warehouse.warehouseName,
      // zone: '-', // ❌ 삭제
      address: `${raw.warehouse.warehouseAddress.addressRoad} ${raw.warehouse.warehouseAddress.addressDetail}`,
      contact: raw.warehouse.contact || '-', // ✅ 실제 contact 반영
    },
    product: {
      name: raw.product.productName,
      code: raw.product.productCode,
      category: raw.product.categoryName,
      unit: raw.product.unitSpec || '-', // ✅ 단위 정보 반영
    },
    inventory: {
      quantity: raw.inventory.quantity,
      reservedQuantity: raw.inventory.reservedQuantity,
      modifiedAt: null, // 해당 정보가 없으면 그대로 둬도 됨
    },
    recentInbounds: raw.inboundHistories.slice(0, 5).map(item => ({
      date: item.inboundedAt,
      quantity: item.quantity,
      manager: item.vendorName,
      note: item.purchaseOrderCode,
    })),
    recentOutbounds: raw.outboundHistories.slice(0, 5).map(item => ({
      date: item.requestedAt,
      quantity: item.quantity, // ✅ 서버 응답에 존재함
      manager: item.carrier,
      destination: item.franchiseName,
    }))
  }

  showModal.value = true
}

// ✅ 페이지 변경
const onPageChange = async (newPage) => {
  page.value = newPage
  await onSearch(lastFilters.value)
}

// ✅ 초기 진입 시 자동 조회
onMounted(() => {
  onSearch(initialFilters)
})
</script>

<template>
  <main>
    <!-- ✅ 페이지 제목 -->
    <section class="page-header">
      <h1 class="page-title">보유 재고 조회</h1>
      <p class="page-description">보유 중인 재고 현황을 조회할 수 있습니다.</p>
    </section>

    <!-- ✅ 필터 영역 -->
    <ListFiltersSection>
      <InventoryFilter @search="onSearch" />
    </ListFiltersSection>

    <!-- ✅ 상단 액션 (비어있음) -->
    <ListTopActions>
      <template #left />
      <template #right />
    </ListTopActions>

    <!-- ✅ 테이블 -->
    <ListTableSection>
      <InventoryTable :items="inventories" @detail="onShowDetail" />
    </ListTableSection>

    <!-- ✅ 페이지네이션 -->
    <Pagination
        v-model="page"
        :total-items="totalItems"
        :items-per-page="pageSize"
        @update:modelValue="onPageChange"
    />

    <!-- ✅ 상세 모달 -->
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
