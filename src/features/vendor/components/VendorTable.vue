<template>
  <GenericTable :items="props.vendors" :columns="columns">
    <template #cell-no="{ index }">
      {{ (props.page - 1) * props.pageSize + index + 1 }}
    </template>

    <template #cell-vendorName="{ value }">
      {{ value }}
    </template>

    <!-- 거래처 주소 -->
    <template #cell-vendorAddress="{ item }">
      <div v-if="item.vendorAddress">
        {{ item.vendorAddress.zipcode }}<br>
        {{ item.vendorAddress.addressRoad }}
        <span v-if="item.vendorAddress.addressDetail">
          {{ item.vendorAddress.addressDetail }}
        </span>
      </div>
      <div v-else>-</div>
    </template>

    <template #cell-vendorManagerName="{ value }">
      {{ value || '-' }}
    </template>

    <template #cell-phoneNumber="{ value }">
      {{ formatPhone(value) }}
    </template>

    <template #cell-vendorType="{ value }">
      {{ value || '-' }}
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

    <template #cell-vendorStartDate="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell-vendorEndDate="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell-detail="{ item }">
      <RouterLink :to="`/vendor/${item.vendorId}`" class="detail-link">
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
  { key: 'vendorStartDate', label: '계약 시작일', align: 'center' },
  { key: 'vendorEndDate', label: '계약 종료일', align: 'center' },
  { key: 'detail', label: '상세', align: 'center' }
]

const formatPhone = (phone) => {
  if (!phone) return '-'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  }
  return phone
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  return date.toISOString().slice(0, 10)
}
</script>

<style scoped>
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
  font-size: 0.8rem;
  padding: 0.25em 1.2em;
  line-height: 1.6;
  letter-spacing: -0.02em;
}

.status-inactive {
  background: rgb(246, 229, 239);
  color: #dc3385;
}
</style>
