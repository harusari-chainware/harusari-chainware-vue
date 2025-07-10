<template>
  <GenericTable :items="requisitions" :columns="columns">
    <!-- 상태 뱃지 -->
    <template #cell-requisitionStatus="{ value }">
      <StatusBadge :status="value" />
    </template>

    <!-- 상세보기 버튼 -->
    <template #cell-actions="{ item }">
      <RouterLink
          :to="{ name: 'RequisitionDetailView', params: { requisitionId: item.requisitionId } }"
          class="detail-link"
      >
        상세보기
      </RouterLink>
    </template>
  </GenericTable>
</template>

<script setup>
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatCurrency } from '@/utils/tableUtils.js'

defineProps({
  requisitions: {
    type: Array,
    required: true,
  },
})

const columns = [
  { key: 'no', label: 'No', align: 'center', format: (_, __, index) => index + 1 },
  { key: 'requisitionCode', label: '품의 코드', align: 'center' },
  { key: 'vendorName', label: '거래처명', align: 'left' },
  { key: 'drafterName', label: '기안자', align: 'center' },
  { key: 'approverName', label: '승인자', align: 'center' },
  { key: 'productCount', label: '품목 수', align: 'right' },
  { key: 'totalQuantity', label: '총 수량', align: 'right' },
  { key: 'totalPrice', label: '총 금액', align: 'right', format: formatCurrency },
  { key: 'submittedAt', label: '상신일', align: 'center' },
  { key: 'reviewedAt', label: '검토일', align: 'center' },
  { key: 'requisitionStatus', label: '품의 상태', align: 'center' },
  { key: 'actions', label: '상세', align: 'center' }
]
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-gray-200);
}
thead tr {
  background-color: var(--color-gray-100);
}
tbody tr:hover {
  background-color: var(--color-gray-50);
}
.detail-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}
.detail-link:hover {
  text-decoration: underline;
}
</style>
