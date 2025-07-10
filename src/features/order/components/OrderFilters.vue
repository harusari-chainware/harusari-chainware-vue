<template>
  <div class="filters-container">
    <!-- 가맹점명 텍스트 검색 -->
    <FilterText
        label="가맹점명"
        v-model="filters.franchiseName"
        placeholder="가맹점 이름 입력"
    />

    <!-- 계약 상태 드롭다운 -->
    <FilterSelect
        label="계약 상태"
        v-model="filters.contractStatus"
        :options="contractStatusOptions"
    />

    <!-- 주문 상태 드롭다운 -->
    <FilterSelect
        label="주문 상태"
        v-model="filters.orderStatus"
        :options="orderStatusOptions"
    />

    <!-- 주문 등록일 범위 필터 -->
    <FilterDateRange
        label="등록일 범위"
        v-model:startDate="filters.startDate"
        v-model:endDate="filters.endDate"
    />

    <!-- 버튼 -->
    <FilterButtons
        @reset="resetFilters"
        @search="emitSearch"
    />
  </div>
</template>

<script setup>
import FilterText from '@/components/common/filters/FilterText.vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'reset'])

const filters = props.filters

const contractStatusOptions = [
  { label: '전체', value: '' },
  { label: '계약 중', value: 'ACTIVE' },
  { label: '계약 만료', value: 'EXPIRED' }
]

const orderStatusOptions = [
  { label: '전체', value: '' },
  { label: '요청됨', value: 'REQUESTED' },
  { label: '승인됨', value: 'APPROVED' },
  { label: '반려됨', value: 'REJECTED' },
  { label: '배송 완료', value: 'DELIVERED' }
]

const resetFilters = () => {
  filters.franchiseName = ''
  filters.contractStatus = ''
  filters.orderStatus = ''
  filters.startDate = ''
  filters.endDate = ''
  emit('reset')
}

const emitSearch = () => {
  emit('search')
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
