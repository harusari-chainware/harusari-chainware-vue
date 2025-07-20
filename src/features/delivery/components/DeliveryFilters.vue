<template>
  <div class="filters-container">
    <!-- 배송 요청일 범위 -->
    <FilterDateRange
        v-model="filters.deliveryDateRange"
        label="배송 요청일"
    />

    <!-- 가맹점명 -->
    <FilterText
        label="가맹점명"
        v-model="filters.franchiseName"
        placeholder="가맹점명 입력"
    />

    <!-- 창고명 -->
    <FilterText
        label="창고명"
        v-model="filters.warehouseName"
        placeholder="창고명 입력"
    />

    <!-- 창고 주소 -->
    <FilterText
        label="창고 주소"
        v-model="filters.warehouseAddress"
        placeholder="창고 주소 입력"
    />

    <!-- 배송 상태 -->
    <FilterSelect
        label="배송 상태"
        v-model="filters.deliveryStatus"
        :options="deliveryStatusOptions"
    />

    <!-- 검색 / 초기화 버튼 -->
    <FilterButtons
        @reset="handleReset"
        @search="emit('search')"
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

const deliveryStatusOptions = [
  {label: '전체', value: ''},
  {label: '요청됨', value: 'REQUESTED'},
  {label: '배송 중', value: 'IN_TRANSIT'},
  {label: '배송 완료', value: 'DELIVERED'}
]

const handleReset = () => {
  props.filters.deliveryDateRange.start = ''
  props.filters.deliveryDateRange.end = ''
  props.filters.franchiseName = ''
  props.filters.warehouseName = ''
  props.filters.warehouseAddress = ''
  props.filters.deliveryStatus = ''
  emit('reset')
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
