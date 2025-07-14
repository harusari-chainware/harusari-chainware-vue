<template>
  <GenericTable :items="purchase" :columns="columns">
    <!-- 상태 컬럼 커스터마이징 -->
    <template #cell-status="{ value }">
      <StatusBadge :status="value" />
    </template>

    <!-- 상세보기 버튼 커스터마이징 -->
    <template #cell-actions="{ item }">
      <RouterLink
          :to="{ name: 'PurchaseOrderDetailView', params: { purchaseOrderId: item.purchaseOrderId } }"
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
import { formatCurrency} from '@/utils/tableUtils.js'

defineProps({
  purchase: {
    type: Array,
    required: true,
  },
})

// 열 정의
const columns = [
  { key: 'no', label: 'No', align: 'center', format: (_, __, index) => index + 1 },
  { key: 'purchaseOrderCode', label: '발주 코드', align: 'center' },
  { key: 'vendorName', label: '거래처명', align: 'left' },
  { key: 'productCount', label: '제품 수', align: 'right' },
  { key: 'totalQuantity', label: '총 수량', align: 'right' },
  { key: 'totalAmount', label: '총 금액', align: 'right', format: formatCurrency },
  { key: 'requisitionCode', label: '관련 품의 코드', align: 'center' },
  { key: 'createdAt', label: '발주 등록일', align: 'center' },
  { key: 'dueDate', label: '납기 요청일', align: 'center' },
  { key: 'warehousedAt', label: '입고 완료일', align: 'center' },
  { key: 'status', label: '발주 상태', align: 'center' },
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