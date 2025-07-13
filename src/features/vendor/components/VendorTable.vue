<template>
  <GenericTable :items="vendors" :columns="columns">
    <template #cell-no="{ index }">
      <span>{{ (page - 1) * pageSize + index + 1 }}</span>
    </template>

    <template #cell-vendorName="{ value }">
      <span>{{ value }}</span>
    </template>

    <!-- 거래처 주소: road + detail 합침 -->
    <template #cell-vendorAddress="{ item }">
      <span>
        {{ item.vendorAddress?.addressRoad || '' }}{{ item.vendorAddress?.addressDetail ? ' ' + item.vendorAddress.addressDetail : '' }}
      </span>
    </template>

    <template #cell-vendorManagerName="{ value }">
      <span>{{ value || '-' }}</span>
    </template>

    <template #cell-phoneNumber="{ value }">
      <span>{{ formatPhone(value) || '-' }}</span>
    </template>

    <template #cell-vendorType="{ value }">
      <span>{{ value || '-' }}</span>
    </template>

    <template #cell-vendorStatus="{ value }">
      <span
          class="status-badge"
          :class="{
          'status-active': value === 'IN_PROGRESS',
          'status-inactive': value === 'TERMINATED'
        }"
      >
        {{ value === 'IN_PROGRESS' ? '계약 진행 중' : '계약 만료' }}
      </span>
    </template>

    <template #cell-vendorEndDate="{ value }">
      <span>{{ formatDate(value) }}</span>
    </template>

    <template #cell-detail="{ item }">
      <RouterLink :to="getDetailLink(item)" class="detail-link">
        상세보기
      </RouterLink>
    </template>
  </GenericTable>
</template>

<script setup>
import { defineProps } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'

const props = defineProps({
  vendors: { type: Array, required: true },
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true }
})

const columns = [
  { key: 'no', label: 'No', align: 'center' },
  { key: 'vendorName', label: '거래처명', align: 'center' },
  { key: 'vendorAddress', label: '거래처 주소', align: 'center' },
  { key: 'vendorManagerName', label: '거래처 관리자', align: 'center' },
  { key: 'phoneNumber', label: '거래처 관리자 연락처', align: 'center' },
  { key: 'vendorType', label: '거래처 유형', align: 'center' },
  { key: 'vendorStatus', label: '거래 상태', align: 'center' },
  { key: 'vendorEndDate', label: '계약 종료일', align: 'center' },
  { key: 'detail', label: '상세', align: 'center' }
]

function formatPhone(phone) {
  if (!phone) return '-'
  // 01012345678 또는 010-1234-5678 모두 처리
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.length === 11)
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  if (digits.length === 10)
    return digits.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  return phone
}

function getDetailLink(item) {
  return `/vendor/${item.vendorId}`
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>
<style scoped>
.detail-btn {
  background: var(--color-primary, #43b3e0);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  height: 34px;
  padding: 0 16px;
  cursor: pointer;
}
.detail-btn:hover { background: var(--color-primary-dark, #1599c6); }
.detail-link {
  color: #43b3e0;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s;
}

.status-badge {
  display: inline-block;
  background: #e8f6fa;
  color: #2196f3;
  font-weight: bold;
  border-radius: 40px;
  min-width: 60px;
  text-align: center;
  font-size: 1.15rem;
  padding: 0.25em 1.2em 0.25em 1.2em;
  line-height: 1.6;
  letter-spacing: -0.02em;
  border: none;
  /* box-shadow: 0 2px 8px 0 #d7eefd; */
}
.status-inactive {
  background: rgb(246, 229, 239);
  color: #dc3385;
}

</style>