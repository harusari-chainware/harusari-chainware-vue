<template>
  <div class="filters-container">
    <!-- 요청자명 -->
    <FilterText
        label="발주 요청자"
        v-model="filters.drafterName"
        placeholder="요청자 이름 입력"
    />

    <!-- 거래처 검색 -->
    <FilterSearchModal
        label="거래처 선택"
        :displayText="filters.selectedVendorName || '거래처 선택'"
        @open="openVendorSearchModal"
    />

    <!-- 발주 상태 -->
    <FilterSelect
        label="발주 상태"
        v-model="filters.status"
        :options="purchaseStatusOptions"
    />

    <FilterDateRange
        label="품의 등록일"
        v-model="filters.createdDateRange"
    />

    <!-- 버튼 -->
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

// 필터 상태
const filters = reactive({
  drafterName: '',
  vendorName: '',
  status: '', // 상태 코드
  createdDateRange: {
    start: '',
    end: ''
  }
})

// 상태 옵션
const purchaseStatusOptions = [
  { label: '요청', value: 'REQUESTED' },
  { label: '요청 취소', value: 'CANCELLED' },
  { label: '승인', value: 'APPROVED' },
  { label: '반려', value: 'REJECTED' },
  { label: '출고 완료', value: 'SHIPPED' },
  { label: '창고 입고', value: 'WAREHOUSED' },
]

// 검색 실행
const applyFilters = () => {
  const query = {}

  if (filters.drafterName) query.drafterName = filters.drafterName
  if (filters.vendorName) query.vendorName = filters.vendorName
  if (filters.status) query.status = filters.status
  if (filters.createdDateRange.start) query.createdFrom = filters.createdDateRange.start
  if (filters.createdDateRange.end) query.createdTo = filters.createdDateRange.end

  router.push({ name: 'PurchaseOrderListView', query })
}

// 초기화
const resetFilters = () => {
  filters.drafterName = ''
  filters.vendorName = ''
  filters.status = ''
  filters.createdDateRange.start = ''
  filters.createdDateRange.end = ''
  filters.selectedVendorName = ''


  router.push({ name: 'PurchaseOrderListView', query: {} })
}

//  거래처 검색 모달
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
