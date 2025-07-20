<template>
  <ListLayout title="배송 목록" description="배송 요청 및 상태 정보를 조회할 수 있습니다.">
    <!-- filters -->
    <template #filters>
      <DeliveryFilters v-model:filters="filters" @search="handleSearch" @reset="resetFilters" />
    </template>

    <!-- table -->
    <template #table>
      <SkeletonList v-if="isLoading" :rows="8" :columns="6" :cellWidth="120" />
      <EmptyResult
          v-else-if="!isLoading && (!Array.isArray(deliveries) || deliveries.length === 0)"
          message="등록된 배송이 없습니다."
      />
      <template v-else>
        <DeliveryTable :deliveries="deliveries" />
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
import { fetchDeliveries } from '../api'

import ListLayout from '@/components/layout/ListLayout.vue'
import DeliveryFilters from '../components/DeliveryFilters.vue'
import DeliveryTable from '../components/DeliveryTable.vue'

import SkeletonList from '@/components/common/SkeletonList.vue'
import EmptyResult from '@/components/common/EmptyResult.vue'
import Pagination from '@/components/common/Pagination.vue'

// 상태 정의
const isLoading = ref(false)
const deliveries = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10

// 필터 상태
const filters = reactive({
  deliveryDateRange: {start: '', end: ''}, // ✅ DateRange는 객체로!
  franchiseName: '',
  warehouseName: '',
  warehouseAddress: '',
  deliveryStatus: ''
})

// 데이터 로딩
const loadDeliveries = async () => {
  isLoading.value = true
  try {
    const params = {
      franchiseName: filters.franchiseName,
      warehouseName: filters.warehouseName,
      warehouseAddress: filters.warehouseAddress,
      deliveryStatus: filters.deliveryStatus,
      startDate: filters.deliveryDateRange.start || null,
      endDate: filters.deliveryDateRange.end || null,
      page: currentPage.value - 1,
      size: itemsPerPage
    }

    const {data} = await fetchDeliveries(params)
    const content = data?.data?.contents ?? []
    const total = data?.data?.totalElements ?? 0

    deliveries.value = content
    totalCount.value = total
  } catch (e) {
    console.error('배송 목록 조회 실패:', e)
  } finally {
    isLoading.value = false
  }
}

// 검색
const handleSearch = () => {
  currentPage.value = 1
  loadDeliveries()
}

// 필터 초기화
const resetFilters = () => {
  filters.deliveryDateRange.start = ''
  filters.deliveryDateRange.end = ''
  filters.franchiseName = ''
  filters.warehouseName = ''
  filters.warehouseAddress = ''
  filters.deliveryStatus = ''
  loadDeliveries()
}

// 페이지 감시
watch(currentPage, loadDeliveries)

// 마운트 시 로딩
onMounted(loadDeliveries)
</script>
