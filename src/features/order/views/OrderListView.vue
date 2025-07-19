<template>
  <ListLayout title="주문 목록" description="모든 주문 목록을 조회하고 관리할 수 있습니다.">
    <!-- filters -->
    <template #filters>
      <OrderFilters v-model:filters="filters" @search="handleSearch" @reset="resetFilters" />
    </template>

    <!-- top-actions -->
    <template #top-actions-left>
      <CreateButton @click="goToCreate">새 주문 작성</CreateButton>
    </template>

    <!-- table -->
    <template #table>
      <SkeletonList v-if="isLoading" :rows="8" :columns="6" :cellWidth="120" />
      <EmptyResult
          v-else-if="!isLoading && (!Array.isArray(orders) || orders.length === 0)"
          message="등록된 주문이 없습니다."
      />
      <template v-else>
        <OrderTable :orders="orders" />
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchOrders } from '../api'

import ListLayout from '@/components/layout/ListLayout.vue'
import EmptyResult from '@/components/common/EmptyResult.vue'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonList from '@/components/common/SkeletonList.vue'
import CreateButton from '@/components/common/top-actions/CreateButton.vue'

import OrderFilters from '../components/OrderFilters.vue'
import OrderTable from '../components/OrderTable.vue'

const router = useRouter()

const isLoading = ref(false)
const orders = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10

const filters = reactive({
  franchiseName: '',
  contractStatus: '',
  orderStatus: '',
  startDate: '',
  endDate: ''
})

const loadOrders = async () => {
  isLoading.value = true
  try {
    const params = {
      ...filters,
      page: currentPage.value - 1,
      size: itemsPerPage
    }
    const { data } = await fetchOrders(params)

    if (!data || !data.data || !Array.isArray(data.data.contents)) {
      orders.value = []
      totalCount.value = 0
      return
    }

    orders.value = data.data.contents
    totalCount.value = data.data.totalElements
  } catch (err) {
    // console.error('주문 목록 조회 실패:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

const resetFilters = () => {
  filters.franchiseName = ''
  filters.contractStatus = ''
  filters.orderStatus = ''
  filters.startDate = ''
  filters.endDate = ''
  loadOrders()
}

const goToCreate = () => {
  router.push({ name: 'OrderRegisterView' })
}

watch(currentPage, loadOrders)
onMounted(loadOrders)
</script>

<style scoped>
</style>