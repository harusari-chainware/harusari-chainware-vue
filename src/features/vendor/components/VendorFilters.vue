<template>
  <div class="filters-container-vertical">
    <div class="filter-row filter-row-fields">
      <div class="filter-input-wrap">
        <label class="filter-label">거래처명</label>
        <input
            class="filter-input"
            v-model="filters.vendorName"
            placeholder="거래처명을 입력하세요"
            type="text"
        />
      </div>
      <div class="filter-input-wrap">
        <label class="filter-label">주소</label>
        <input
            class="filter-input"
            v-model="filters.vendorAddress"
            placeholder="주소(우편번호/도로명/상세주소) 입력"
            type="text"
        />
      </div>
      <FilterSelect
          label="거래처 유형"
          v-model="filters.vendorType"
          :options="vendorTypeOptions"
      />
      <FilterSelect
          label="거래 상태"
          v-model="filters.vendorStatus"
          :options="vendorStatusOptions"
      />
      <div class="filter-input-wrap">
        <FilterDateRange
            label="계약일"
            v-model="filters.vendorDate"
            placeholder="날짜 범위 선택"
        />
      </div>
    </div>
    <div class="filter-row filter-row-buttons">
      <div class="filter-buttons">
        <VendorFilterButtons @reset="resetFilters" @apply="applyFilters" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterDateRange from "@/components/common/filters/FilterDateRange.vue";
import VendorFilterButtons from "@/features/vendor/components/VendorFilterButtons.vue";

// 필터 state (백엔드 DTO와 동일하게!)
const filters = reactive({
  vendorName: '',
  vendorAddress: '',   // 한 칸에 전부 검색
  vendorType: '',
  vendorStatus: '',
  vendorDate: { start: '', end: '' }
})
const emit = defineEmits(['apply', 'reset'])

function applyFilters() {
  const params = {
    ...filters,
    vendorName: filters.vendorName,
    zipcode: filters.vendorAddress,
    addressRoad: filters.vendorAddress,
    addressDetail: filters.vendorAddress,
    vendorType: filters.vendorType,
    vendorStatus: filters.vendorStatus,
    vendorStartDate: filters.vendorDate.start,
    vendorEndDate: filters.vendorDate.end,
  }
  // 👇 불필요한 파라미터 삭제
  delete params.vendorDate

  // 빈 값 파라미터 삭제
  Object.keys(params).forEach(key => {
    if (
        params[key] === '' ||
        params[key] == null ||
        (typeof params[key] === 'object' && params[key] !== null && Object.values(params[key]).every(v => v === ''))
    ) {
      delete params[key]
    }
  })

  emit('apply', params)
}

function resetFilters() {
  Object.keys(filters).forEach(k => {
    if (k === 'vendorDate') filters[k] = { start: '', end: '' }
    else filters[k] = ''
  })
  emit('reset')
}

const vendorTypeOptions = [
  { label: 'SUPPLIER', value: 'SUPPLIER' },
  { label: 'TRUST_CONTRACTOR', value: 'TRUST_CONTRACTOR' },
  { label: 'LOGISTICS', value: 'LOGISTICS' },
  { label: 'AGENCY', value: 'AGENCY' }
]
const vendorStatusOptions = [
  { label: '계약 진행 중', value: 'IN_PROGRESS' },
  { label: '계약 만료', value: 'TERMINATED' }
]

</script>

<style scoped>
.filters-container-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: auto;
  margin-right: auto;
}
.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 28px;
  align-items: center;
  width: 100%;
}
.filter-row > * {
  width: 100%;
  min-width: 0;
}
.filter-input,
.filter-select-root {
  width: 100%;
  min-width: 0;
}
.filter-input-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.filter-label {
  font-weight: 450;
  color: var(--color-gray-900, #222);
  margin-bottom: 5px;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
}
.filter-input {
  border: 1px solid #e4e7ee;
  border-radius: 8px;
  background: #fafbfc;
  height: 38px;
  font-size: 1rem;
  padding: 0 13px;
  color: var(--color-gray-900, #222);
  width: 100%;
}
.filter-row-buttons {
  display: flex;
  justify-content: flex-end;  /* 오른쪽 정렬 */
  width: 100%;
}
.filter-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
