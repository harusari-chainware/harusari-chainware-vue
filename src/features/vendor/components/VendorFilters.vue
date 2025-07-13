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
            v-model="filters.address"
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
    </div>
    <div class="filter-row filter-row-buttons">
      <div></div><div></div><div></div><div></div>
      <div class="filter-buttons">
        <FilterButtons @reset="resetFilters" @apply="applyFilters" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'

// 필터 state (백엔드 DTO와 동일하게!)
const filters = reactive({
  vendorName: '',
  address: '',   // 한 칸에 전부 검색
  vendorType: '',
  vendorStatus: '',
  vendorDate: ''
})
const emit = defineEmits(['apply', 'reset'])

function applyFilters() {
  const params = {
    ...filters,
    zipcode: filters.address,
    addressRoad: filters.address,
    addressDetail: filters.address,
  }
  delete params.address
  emit('apply', params)
}

function resetFilters() {
  Object.keys(filters).forEach(k => filters[k] = '')
  emit('reset')
}

const vendorTypeOptions = [
  { label: 'SUPPLIER', value: 'SUPPLIER' },
  { label: 'TRUST_CONTRACTOR', value: 'TRUST_CONTRACTOR' },
  { label: 'LOGISTICS', value: 'LOGISTICS' },
  { label: 'AGENCY', value: 'AGENCY' }
]
const vendorStatusOptions = [
  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
  { label: 'TERMINATED', value: 'TERMINATED' }
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
.filter-buttons {
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
</style>
