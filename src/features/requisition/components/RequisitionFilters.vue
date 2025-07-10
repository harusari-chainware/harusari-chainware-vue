<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FilterText from '@/components/common/filters/FilterText.vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'
import FilterSearchModal from '@/components/common/filters/FilterSearchModal.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'

const router = useRouter()

// 필터 상태
const filters = reactive({
  drafterName: '',
  approverName: '',
  vendorName: '',
  requisitionStatus: '',
  createdDateRange: {
    start: '',
    end: ''
  },
  selectedVendorName: ''
})

// 드롭다운 옵션
const requisitionStatusOptions = [
  { label: '전체', value: '' },
  { label: '작성 중', value: 'SAVED' },
  { label: '상신됨', value: 'SUBMITTED' },
  { label: '승인 완료', value: 'APPROVED' },
  { label: '반려됨', value: 'REJECTED' }
]

// 검색
const applyFilters = () => {
  const query = {}

  if (filters.drafterName) query.drafterName = filters.drafterName
  if (filters.approverName) query.approverName = filters.approverName
  if (filters.vendorName) query.vendorName = filters.vendorName
  if (filters.requisitionStatus) query.status = filters.requisitionStatus
  if (filters.createdDateRange.start) query.createdFrom = filters.createdDateRange.start
  if (filters.createdDateRange.end) query.createdTo = filters.createdDateRange.end

  router.push({ name: 'RequisitionListView', query })
}

// 초기화
const resetFilters = () => {
  filters.drafterName = ''
  filters.approverName = ''
  filters.vendorName = ''
  filters.requisitionStatus = ''
  filters.createdDateRange.start = ''
  filters.createdDateRange.end = ''
  filters.selectedVendorName = ''

  // URL 쿼리 초기화 → 전체 목록 조회
  router.push({ name: 'RequisitionListView', query: {} })
}

// 모달 열기
const openVendorSearchModal = () => {
  alert('거래처 검색 모달 열기 (예시)')
}
</script>

<template>
  <div class="filters-container">
    <FilterText
        label="기안자"
        v-model="filters.drafterName"
        placeholder="기안자 이름 입력"
    />

    <FilterText
        label="결재자"
        v-model="filters.approverName"
        placeholder="결재자 이름 입력"
    />

    <FilterSelect
        label="품의 상태"
        v-model="filters.requisitionStatus"
        :options="requisitionStatusOptions"
    />

    <FilterText
        label="거래처명"
        v-model="filters.vendorName"
        placeholder="거래처 이름 입력"
    />

    <FilterDateRange
        label="품의 등록일"
        v-model="filters.createdDateRange"
    />

    <FilterSearchModal
        label="거래처 선택"
        :displayText="filters.selectedVendorName || '거래처 선택'"
        @open="openVendorSearchModal"
    />

    <FilterButtons
        @reset="resetFilters"
        @apply="applyFilters"
    />
  </div>
</template>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
