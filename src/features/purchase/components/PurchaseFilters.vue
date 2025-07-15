<template>
  <div class="filters-container">
    <!-- 요청자명 -->
    <FilterText
        label="발주 요청자"
        v-model="filters.drafterName"
        placeholder="요청자 이름 입력"
    />

    <!-- 상태 선택 -->
    <FilterSelect
        label="발주 상태"
        v-model="filters.purchaseStatus"
        :options="purchaseStatusOptions"
    />

    <!-- 거래처 모달 필터 -->
    <FilterSearchModal
        label="거래처 선택"
        :displayText="filters.selectedVendorName || '거래처 선택'"
        @open="openVendorSearchModal"
    />

    <!-- 발주일 구간 -->
    <FilterDateRange
        label="발주 기간"
        v-model="filters.dueDateRange"
    />

    <!-- ✅ 버튼 -->
    <FilterButtons
        @reset="resetFilters"
        @search="applyFilters"
    />

    <!-- 거래처 검색 모달 -->
    <VendorSearchModal
        :visible="isVendorModalVisible"
        @update:visible="val => isVendorModalVisible = val"
        @select="handleVendorSelect"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import FilterText from '@/components/common/filters/FilterText.vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'
import FilterSearchModal from '@/components/common/filters/FilterSearchModal.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'
import VendorSearchModal from '@/components/common/fields/VendorSearchModal.vue'

const router = useRouter()
const route = useRoute()

const filters = reactive({
  drafterName: '',
  vendorName: '',
  purchaseStatus: '',
  dueDateRange: {
    start: '',
    end: ''
  },
  selectedVendorName: ''
})

const purchaseStatusOptions = [
  { label: '전체', value: '' },
  { label: '요청', value: 'REQUESTED' },
  { label: '요청 취소', value: 'CANCELLED' },
  { label: '승인', value: 'APPROVED' },
  { label: '반려', value: 'REJECTED' },
  { label: '출고 완료', value: 'SHIPPED' },
  { label: '창고 입고', value: 'WAREHOUSED' },
]

// ✅ 쿼리로부터 필터 초기값 세팅 (새로고침 대비)
onMounted(() => {
  const q = route.query
  filters.drafterName = q.drafterName || ''
  filters.vendorName = q.vendorName || ''
  filters.selectedVendorName = q.vendorName || ''
  filters.purchaseStatus = q.purchaseStatus || ''
  filters.dueDateRange.start = q.dueStart || ''
  filters.dueDateRange.end = q.dueEnd || ''
})

// ✅ 검색
const applyFilters = () => {
  const query = {}

  if (filters.drafterName) query.drafterName = filters.drafterName
  if (filters.vendorName) query.vendorName = filters.vendorName
  if (filters.purchaseStatus) query.purchaseStatus = filters.purchaseStatus
  if (filters.dueDateRange.start) query.dueStart = filters.dueDateRange.start
  if (filters.dueDateRange.end) query.dueEnd = filters.dueDateRange.end

  router.push({ name: 'PurchaseOrderListView', query })
}

// ✅ 초기화
const resetFilters = () => {
  filters.drafterName = ''
  filters.vendorName = ''
  filters.selectedVendorName = ''
  filters.purchaseStatus = ''
  filters.dueDateRange.start = ''
  filters.dueDateRange.end = ''

  router.push({ name: 'PurchaseOrderListView', query: {} })
}

// ✅ 거래처 모달
const isVendorModalVisible = ref(false)
const openVendorSearchModal = () => {
  isVendorModalVisible.value = true
}
const handleVendorSelect = (vendor) => {
  filters.vendorName = vendor.vendorName
  filters.selectedVendorName = vendor.vendorName
  isVendorModalVisible.value = false
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
