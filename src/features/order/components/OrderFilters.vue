<template>
  <div class="filters-container">
    <!-- 가맹점명 텍스트 검색 -->
    <FilterText
        label="가맹점명"
        v-model="filters.franchiseName"
        placeholder="가맹점 이름 입력"
    />

    <!-- 주문 상태 드롭다운 -->
    <FilterSelect
        label="주문 상태"
        v-model="filters.orderStatus"
        :options="statusOptions"
    />

    <!-- 주문 등록일 (단일 날짜 필터) -->
    <FilterDate
        label="주문 등록일"
        v-model="filters.createdDate"
    />

    <!-- 주문 요청 기간 (날짜 구간 필터) -->
    <FilterDateRange
        label="납기 요청 기간"
        v-model="filters.dueDateRange"
    />

    <!-- 가맹점 검색 (모달 필터) -->
    <FilterSearchModal
        label="가맹점 선택"
        :displayText="filters.selectedFranchiseName || '가맹점 선택'"
        @open="openFranchiseSearchModal"
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
import FilterDate from '@/components/common/filters/FilterDate.vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'
import FilterSearchModal from '@/components/common/filters/FilterSearchModal.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'

const router = useRouter()

// 기본 필터 상태
const filters = reactive({
  franchiseName: '',
  orderStatus: '',
  createdDate: '',
  dueDateRange: {
    start: '',
    end: ''
  },
  selectedFranchiseName: ''
})

// 드롭다운 옵션
const statusOptions = [
  { label: '전체', value: '' },
  { label: '승인 대기중', value: 'PENDING' },
  { label: '승인됨', value: 'APPROVED' },
  { label: '반려됨', value: 'REJECTED' },
  { label: '완료', value: 'DELIVERED' }
]

// 검색 버튼 클릭 시 query param으로 이동 (예시)
const applyFilters = () => {
  const query = {}

  if (filters.franchiseName) query.franchiseName = filters.franchiseName
  if (filters.orderStatus) query.orderStatus = filters.orderStatus
  if (filters.createdDate) query.createdDate = filters.createdDate
  if (filters.dueDateRange.start) query.dueStart = filters.dueDateRange.start
  if (filters.dueDateRange.end) query.dueEnd = filters.dueDateRange.end
  if (filters.selectedFranchiseName) query.selectedFranchise = filters.selectedFranchiseName

  router.push({ name: 'OrderListView', query })
}

// 초기화 버튼
const resetFilters = () => {
  filters.franchiseName = ''
  filters.orderStatus = ''
  filters.createdDate = ''
  filters.dueDateRange.start = ''
  filters.dueDateRange.end = ''
  filters.selectedFranchiseName = ''
}

// 모달 열기 (가맹점 검색용)
const openFranchiseSearchModal = () => {
  // 예시: 모달 띄우고, 가맹점 선택되면 filters.selectedFranchiseName을 업데이트
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
