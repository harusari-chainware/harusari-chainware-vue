<template>
  <div class="filters-container">


    <!-- 발주 요청자명 텍스트 검색 -->
    <FilterText
        label="발주 요청자"
        v-model="filters.drafterName"
        placeholder="발주 요청자 이름 입력"
    />

    <!-- 거래처 담당자명 텍스트 검색 -->
    <FilterText
        label="거래처 담당자"
        v-model="filters.vendorManagerName"
        placeholder="거래처 담당자 이름 입력"
    />
    <!-- 주문 상태 드롭다운 -->
    <FilterSelect
        label="발주 상태"
        v-model="filters.purchaseStatus"
        :options="purchaseStatusOptions"
    />

    <!-- 가맹점명 텍스트 검색 -->
    <FilterText
        label="거래처명"
        v-model="filters.vendorName"
        placeholder="거래처 이름 입력"
    />

    <!-- 발주 기간 (날짜 구간 필터) -->
    <FilterDateRange
        label="발주 기간"
        v-model="filters.dueDateRange"
    />

    <!-- 거래처 검색 (모달 필터) -->
    <FilterSearchModal
        label="거래처 선택"
        :displayText="filters.selectedVendorName || '거래처 선택'"
        @open="openVendorSearchModal"
    />

    <!-- 버튼 -->
    <FilterButtons
        @reset="resetFilters"
        @search="applyFilters"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FilterText from '@/components/common/filters/FilterText.vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'
import FilterSearchModal from '@/components/common/filters/FilterSearchModal.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'

const router = useRouter()

// 기본 필터 상태
const filters = reactive({
  drafterName: '',
  vendorManagerName: '',
  vendorName: '',
  purchaseStatus: '',
  createdDate: '',
  dueDateRange: {
    start: '',
    end: ''
  },
  selectedVendorName: ''
})

// 드롭다운 옵션
const purchaseStatusOptions = [
  { label: '전체', value: '' },
  { label: '요청', value: 'REQUESTED' },
  { label: '요청 취소', value: 'CANCELLED' },
  { label: '승인', value: 'APPROVED' },
  { label: '반려', value: 'REJECTED' },
  { label: '출고 완료', value: 'SHIPPED' },
  { label: '창고 입고', value: 'WAREHOUSED' },
]


// 검색 버튼 클릭 시 query param으로 이동 (예시)
const applyFilters = () => {
  const query = {}

  if (filters.drafterName) query.drafterName = filters.drafterName
  if (filters.vendorManagerName) query.vendorManagerName = filters.vendorManagerName
  if (filters.vendorName) query.vendorName = filters.vendorName
  if (filters.purchaseStatus) query.purchaseStatus = filters.purchaseStatus
  if (filters.dueDateRange.start) query.dueStart = filters.dueDateRange.start
  if (filters.dueDateRange.end) query.dueEnd = filters.dueDateRange.end
  if (filters.selectedVendorName) query.selectedVendorName = filters.selectedVendorName // UI 표시용

  router.push({ name: 'PurchaseOrderListView', query })
}
// 초기화 버튼
const resetFilters = () => {
  filters.vendorName = ''
  filters.orderStatus = ''
  filters.createdDate = ''
  filters.dueDateRange.start = ''
  filters.dueDateRange.end = ''
  filters.selectedvendorName = ''
}

// 모달 열기 (가맹점 검색용)
const openVendorSearchModal = () => {
  // 예시: 모달 띄우고, 가맹점 선택되면 filters.selectedvendorName을 업데이트
  // 실제 구현에서는 store 또는 emit 방식으로 선택 결과 처리
  alert('가맹점 검색 모달 열기 (예시)')
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
