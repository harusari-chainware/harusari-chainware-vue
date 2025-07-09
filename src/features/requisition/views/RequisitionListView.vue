<template>
  <ListLayout
      title="품의서 목록"
      description="모든 품의서 목록을 조회하고 관리할 수 있습니다."
  >
    <!-- filters -->
    <template #filters>
      <RequisitionFilters />
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
          v-else-if="!isLoading && Array.isArray(requisitions) && requisitions.length === 0"
          message="등록된 품의서가 없습니다."
      />
      <template v-else>
        <RequisitionTable :requisitions="pagedRequisitions" />
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
import { getRequisitionList } from '@/features/requisition/RequisitionApi.js'

import ListLayout from '@/components/layout/ListLayout.vue'
import RequisitionFilters from '@/features/requisition/components/RequisitionFilters.vue'
import RequisitionTable from '@/features/requisition/components/RequisitionTable.vue'

import SortDropdown from '@/components/common/top-actions/SortDropdown.vue'
import SortOrderSelect from '@/components/common/top-actions/SortOrderSelect.vue'
import SkeletonList from '@/components/common/SkeletonList.vue'
import EmptyResult from '@/components/common/EmptyResult.vue'
import Pagination from '@/components/common/Pagination.vue'

// 상태
const requisitions = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 10
const totalCount = ref(0)

const sortKey = ref('createdAt')
const sortOrder = ref('desc')

// 페이징된 데이터
const pagedRequisitions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return requisitions.value.slice(start, start + itemsPerPage)
})

// API 호출
const fetchRequisitions = async () => {
  isLoading.value = true
  try {
    const res = await getRequisitionList({
      page: currentPage.value - 1,
      size: itemsPerPage,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value
    })

    // ✅ 구조에 맞게 변경
    requisitions.value = Array.isArray(res.data.data) ? res.data.data : []
    totalCount.value = requisitions.value.length
  } catch (e) {
    console.error('❌ 품의서 목록 조회 실패', e)
    requisitions.value = []
    totalCount.value = 0
  } finally {
    isLoading.value = false
  }
}


// 초기 요청 및 반응형 트리거
onMounted(fetchRequisitions)
watch([currentPage, sortKey, sortOrder], fetchRequisitions)

// 정렬 옵션
const sortOptions = [
  { label: '등록일', value: 'createdAt' },
  { label: '품의 코드', value: 'requisitionCode' },
  { label: '총 금액', value: 'totalPrice' }
]
</script>
