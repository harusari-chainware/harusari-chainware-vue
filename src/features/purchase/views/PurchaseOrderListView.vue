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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPurchaseOrders } from '@/features/purchase/PurchaseApi.js' // 실제 API
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
const currentPage = ref(Number(route.query.page) || 1)
const sortKey = ref(route.query.sortKey || 'createdAt')
const sortOrder = ref(route.query.sortOrder || 'asc')
const totalCount = ref(0)
const itemsPerPage = 10

const fetchPurchaseOrders = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value
      // TODO: filters도 함께 추가 가능
    }
    const res = await getPurchaseOrders(params)
    purchase.value = res.data.data
  } catch (err) {
    console.error('발주 목록 조회 실패', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPurchaseOrders)

watch([sortKey, sortOrder, currentPage], fetchPurchaseOrders)

const pagedPurchase = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return purchase.value.slice(start, end)
})

</script>
