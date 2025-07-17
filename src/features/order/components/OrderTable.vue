<template>
  <GenericTable :items="orders ?? []" :columns="columns">
    <!-- 상태 컬럼 커스터마이징 -->
    <template #cell-orderStatus="{ value }">
      <StatusBadge :status="value" />
    </template>

    <template #cell-deliveryCode="{ value }">
      {{ value? value: '-' }}
    </template>

    <!-- 상세보기 버튼 커스터마이징 -->
    <template #cell-actions="{ item }">
      <RouterLink :to="{ name: 'OrderDetailView', params: { orderId: item.orderId } }" class="detail-link">
        상세보기
      </RouterLink>
    </template>
  </GenericTable>
</template>

<script setup>
import { defineProps } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import {formatCurrency, formatDateTime, formatDate, formatAmount} from '@/utils/tableUtils'

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
})

// 열 정의
const columns = [
  { key: 'orderCode', label: '주문코드', align: 'center' },
  { key: 'franchiseName', label: '가맹점명', align: 'left' },
  { key: 'productCount', label: '총 제품 수', align: 'right', format: formatAmount },
  { key: 'totalPrice', label: '총 금액', align: 'right', format: formatCurrency },
  { key: 'deliveryCode', label: '배송코드', align: 'center' },
  { key: 'createdAt', label: '등록일', align: 'center', format: formatDateTime },
  { key: 'deliveryDueDate', label: '납기일', align: 'center', format: formatDate },
  { key: 'deliveryCompletedAt', label: '배송완료일', align: 'center', format: formatDateTime },
  { key: 'orderStatus', label: '상태', align: 'center' },
  { key: 'actions', label: '상세', align: 'center' },
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
