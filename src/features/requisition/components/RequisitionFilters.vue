<template>
  <div class="filters-container">
    <FilterText
        label="기안자"
        v-model="filters.drafterName"
        placeholder="기안자 이름 입력"
    />

    <FilterText
        label="승인자"
        v-model="filters.approverName"
        placeholder="승인자 이름 입력"
    />


    <!-- 품의 상태 -->
    <FilterSelect
        label="품의 상태"
        v-model="filters.requisitionStatus"
        :options="requisitionStatusOptions"
    />

    <!-- 거래처명 -->
    <FilterText
        label="거래처명"
        v-model="filters.vendorName"
        placeholder="거래처 이름 입력"
    />

    <!-- 품의 등록일 -->
    <FilterDateRange
        label="품의 등록일"
        v-model="filters.createdDateRange"
    />

    <!-- 거래처 검색 (모달) -->
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
  { label: '작성 중', value: 'DRAFT' },
  { label: '승인 대기', value: 'PENDING' },
  { label: '승인 완료', value: 'APPROVED' },
  { label: '반려됨', value: 'REJECTED' }
]

// 검색
const applyFilters = () => {
  const query = {}

  if (filters.createdMemberName) query.createdMemberName = filters.createdMemberName
  if (filters.approvedMemberName) query.approvedMemberName = filters.approvedMemberName
  if (filters.vendorName) query.vendorName = filters.vendorName
  if (filters.requisitionStatus) query.requisitionStatus = filters.requisitionStatus
  if (filters.createdDateRange.start) query.createdStart = filters.createdDateRange.start
  if (filters.createdDateRange.end) query.createdEnd = filters.createdDateRange.end
  if (filters.selectedVendorName) query.selectedVendorName = filters.selectedVendorName // UI용

  router.push({ name: 'RequisitionListView', query })
}

// 초기화
const resetFilters = () => {
  filters.createdMemberName = ''
  filters.approvedMemberName = ''
  filters.vendorName = ''
  filters.requisitionStatus = ''
  filters.createdDateRange.start = ''
  filters.createdDateRange.end = ''
  filters.selectedVendorName = ''
}

// 모달 열기
const openVendorSearchModal = () => {
  alert('거래처 검색 모달 열기 (예시)')
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
