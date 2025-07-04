<template>
  <ListLayout
      title="주문 목록"
      description="모든 주문 목록을 조회하고 관리할 수 있습니다."
  >
    <!-- filters -->
    <template #filters>
      <OrderFilters />
    </template>

    <!-- top-actions -->
    <template #top-actions-left>
      <CreateButton @click="goToCreate">새 주문 작성</CreateButton>
    </template>

    <template #top-actions-right>
      <SortDropdown v-model="sortKey" :options="sortOptions" />
      <SortOrderSelect v-model="sortOrder" />
    </template>

    <!-- table -->
    <template #table>
      <OrderTable :orders="pagedOrders" />
      <Pagination
          v-model="currentPage"
          :total-items="totalCount"
          :items-per-page="itemsPerPage"
      />
    </template>
  </ListLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import ListLayout from '@/components/layout/ListLayout.vue'
import OrderFilters from '../components/OrderFilters.vue'
import OrderTable from '../components/OrderTable.vue'
import Pagination from '@/components/common/Pagination.vue'

import CreateButton from '@/components/common/top-actions/CreateButton.vue'
import SortDropdown from '@/components/common/top-actions/SortDropdown.vue'
import SortOrderSelect from '@/components/common/top-actions/SortOrderSelect.vue'

const router = useRouter()

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 10

// 정렬
const sortKey = ref('createdAt')
const sortOrder = ref('asc')

const sortOptions = [
  { label: '주문 등록일', value: 'createdAt' },
  { label: '납기 요청일', value: 'dueDate' },
  { label: '총 금액', value: 'totalAmount' }
]

// 더미 주문 데이터
const orders = ref([
  {
    id: 1,
    orderCode: 'ORD-001',
    franchiseName: '강남1호점',
    totalProducts: 3,
    totalAmount: 48000,
    deliveryCode: 'D-1001',
    createdAt: '2025-07-01',
    dueDate: '2025-07-05',
    deliveredAt: '',
    status: 'PENDING'
  },
  {
    id: 2,
    orderCode: 'ORD-002',
    franchiseName: '신촌2호점',
    totalProducts: 5,
    totalAmount: 72000,
    deliveryCode: 'D-1002',
    createdAt: '2025-07-02',
    dueDate: '2025-07-07',
    deliveredAt: '2025-07-06',
    status: 'DELIVERED'
  }
])

// 정렬 기준 바뀔 때 쿼리 반영
watch([sortKey, sortOrder], ([key, order]) => {
  router.push({ query: { sortKey: key, sortOrder: order } })
})

// 정렬 + 페이징된 결과 반환
const totalCount = computed(() => orders.value.length)

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return orders.value.slice(start, end)
})

// 작성 페이지로 이동 (예시용으로 현재 페이지 유지)
const goToCreate = () => {
  router.push({name: 'OrderDummy2View'})
}
</script>

