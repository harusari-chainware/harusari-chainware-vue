<template>
  <ListLayout
      title="발주 목록"
      description="모든 발주 목록을 조회하고 관리할 수 있습니다."
  >
    <!-- filters -->
    <template #filters>
      <OrderFilters />
    </template>

    <!-- top-actions -->
    <template #top-actions-right>
      <SortDropdown v-model="sortKey" :options="sortOptions" />
      <SortOrderSelect v-model="sortOrder" />
    </template>

    <!-- table -->
    <template #table>
      <SkeletonList v-if="isLoading" :rows="8" :columns="6" :cellWidth="120" />
      <EmptyResult
          v-else-if="!isLoading && purchase.length === 0"
          message="등록된 발주가 없습니다."
      />
      <template v-else>
        <PurchaseTable :purchase="pagedPurchase" />
        <Pagination
            v-model="currentPage"
            :total-items="totalCount"
            :items-per-page="itemsPerPage"
        />
      </template>
    </template>
  </ListLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPurchaseOrders } from '@/features/purchase/PurchaseApi.js'
import ListLayout from '@/components/layout/ListLayout.vue'
import EmptyResult from "@/components/common/EmptyResult.vue"
import Pagination from "@/components/common/Pagination.vue"
import SkeletonList from "@/components/common/SkeletonList.vue"
import SortDropdown from "@/components/common/top-actions/SortDropdown.vue"
import SortOrderSelect from "@/components/common/top-actions/SortOrderSelect.vue"
import OrderFilters from '../components/PurchaseFilters.vue'
import PurchaseTable from "@/features/purchase/components/PurchaseTable.vue"

const router = useRouter()
const route = useRoute()

const purchase = ref([])
const isLoading = ref(true)
const totalCount = ref(0)

const currentPage = ref(Number(route.query.page) || 1)
const sortKey = ref(route.query.sortKey || 'createdAt')
const sortOrder = ref(route.query.sortOrder || 'asc')
const itemsPerPage = 10

// ✅ API 호출
const fetchPurchaseOrders = async () => {
  isLoading.value = true
  try {
    const query = route.query
    const params = {
      page: Number(query.page || 1) - 1,
      size: itemsPerPage,
      sortKey: query.sortKey || 'createdAt',
      sortOrder: query.sortOrder || 'asc',
      drafterName: query.drafterName || '',
      vendorName: query.vendorName || '',
      purchaseStatus: query.purchaseStatus || '',
      dueStart: query.dueStart || '',
      dueEnd: query.dueEnd || ''
    }

    const res = await getPurchaseOrders(params)
    purchase.value = res.data.data || []
    totalCount.value = res.data.totalCount || purchase.value.length
  } catch (err) {
    console.error('발주 목록 조회 실패', err)
  } finally {
    isLoading.value = false
  }
}

// ✅ 쿼리 변경 시 API 재호출
watch(() => route.query, () => {
  currentPage.value = Number(route.query.page || 1)
  sortKey.value = route.query.sortKey || 'createdAt'
  sortOrder.value = route.query.sortOrder || 'asc'
  fetchPurchaseOrders()
}, { immediate: true })


// ✅ 정렬/페이지 변경 시 쿼리 갱신
watch([sortKey, sortOrder], () => {
  router.push({
    name: 'PurchaseOrderListView',
    query: {
      ...route.query,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value,
      page: 1 // 정렬 변경 시 페이지 초기화
    }
  })
})

watch(currentPage, (val) => {
  router.push({
    name: 'PurchaseOrderListView',
    query: {
      ...route.query,
      page: val
    }
  })
})

const pagedPurchase = computed(() => purchase.value)
</script>
