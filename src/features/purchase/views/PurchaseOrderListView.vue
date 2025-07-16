<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPurchaseOrders } from "@/features/purchase/PurchaseApi.js";
import ListLayout from "@/components/layout/ListLayout.vue";
import PurchaseFilters from "@/features/purchase/components/PurchaseFilters.vue";
import SortDropdown from "@/components/common/top-actions/SortDropdown.vue";
import SortOrderSelect from "@/components/common/top-actions/SortOrderSelect.vue";
import SkeletonList from "@/components/common/SkeletonList.vue";
import EmptyResult from "@/components/common/EmptyResult.vue";
import PurchaseTable from "@/features/purchase/components/PurchaseTable.vue";
import Pagination from "@/components/common/Pagination.vue";


const route = useRoute()
const router = useRouter()

const purchaseOrders = ref([])
const isLoading = ref(false)
const totalCount = ref(0)

const sortKey = ref(route.query.sortKey || 'createdAt')
const sortOrder = ref(route.query.sortOrder || 'desc')
const currentPage = ref(Number(route.query.page || 1))
const itemsPerPage = 10

const pagedPurchaseOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return purchaseOrders.value.slice(start, start + itemsPerPage)
})

// fetch 함수: Requisition 구조 동일하게 적용
const fetchPurchaseOrders = async () => {
  isLoading.value = true
  try {
    const res = await getPurchaseOrders({
      ...route.query,
      page: currentPage.value - 1,
      size: itemsPerPage,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value
    })

    purchaseOrders.value = Array.isArray(res.data.data) ? res.data.data : []
    totalCount.value = res.data.total || purchaseOrders.value.length
  } catch (e) {
    console.error('발주 목록 조회 실패', e)
    purchaseOrders.value = []
    totalCount.value = 0
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    // 쿼리 제거 후 리다이렉트 → 이후 watch가 getPurchaseOrders 자동 실행
    router.replace({ name: 'PurchaseOrderListView', query: {} })
  } else {
    fetchPurchaseOrders()
  }
})
// 페이지 변경 시 재조회
watch(
    [() => currentPage.value, () => sortKey.value, () => sortOrder.value, () => route.query],
    fetchPurchaseOrders,
    { immediate: true }
)

const sortOptions = [
  { label: '등록일', value: 'createdAt' },
  { label: '품의 코드', value: 'requisitionCode' },
  { label: '총 금액', value: 'totalPrice' }
]
</script>

<template>
  <ListLayout
      title="발주 목록"
      description="모든 발주 목록을 조회하고 관리할 수 있습니다."
  >
    <template #filters>
      <PurchaseFilters />
    </template>

    <template #top-actions-right>
      <SortDropdown v-model="sortKey" :options="['createdAt', 'dueDate']" />
      <SortOrderSelect v-model="sortOrder" />
    </template>

    <template #table>
      <SkeletonList v-if="isLoading" :rows="8" :columns="6" :cellWidth="120" />
      <EmptyResult
          v-else-if="!isLoading && purchaseOrders.length === 0"
          message="등록된 발주가 없습니다."
      />
      <template v-else>
        <PurchaseTable :purchase="pagedPurchaseOrders" />
        <Pagination
            v-model="currentPage"
            :total-items="totalCount"
            :items-per-page="itemsPerPage"
        />
      </template>
    </template>
  </ListLayout>
</template>
