<template>
  <GenericTable :items="orders" :columns="columns">
    <!-- 상태 컬럼 커스터마이징 -->
    <template #cell-status="{ value }">
      <span class="status-badge" :class="statusClass(value)">
        {{ statusText(value) }}
      </span>
    </template>

    <!-- 상세보기 버튼 커스터마이징 -->
    <template #cell-actions="{ item }">
      <RouterLink
          :to="{ name: 'OrderDummy2View' }"
          class="detail-link"
      >
        상세보기
      </RouterLink>
    </template>
  </GenericTable>
</template>

<script setup>
import GenericTable from '@/components/common/GenericTable.vue'
import { formatCurrency, statusText, statusClass } from '@/utils/tableUtils'

defineProps({
  orders: {
    type: Array,
    required: true,
  },
})

// 열 정의
const columns = [
  { key: 'no', label: 'No', format: (_, item, index) => index + 1 },
  { key: 'orderCode', label: '주문코드' },
  { key: 'franchiseName', label: '가맹점명' },
  { key: 'totalProducts', label: '총 제품 수' },
  { key: 'totalAmount', label: '총 금액', format: formatCurrency, align: 'right' },
  { key: 'deliveryCode', label: '관련 배송 코드' },
  { key: 'createdAt', label: '주문 등록일' },
  { key: 'dueDate', label: '납기 요청일' },
  { key: 'deliveredAt', label: '배송 완료일' },
  { key: 'status', label: '주문 상태' },
  { key: 'actions', label: '상세' },
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
  border-bottom: 1px solid #e5e7eb;
}
thead tr {
  background-color: #f4f6f9;
}
tbody tr:hover {
  background-color: #f9f9f9;
}
.detail-link {
  color: #3aaed8;
  text-decoration: none;
  font-weight: 500;
}
.detail-link:hover {
  text-decoration: underline;
}
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
}
.page-link:hover {
  background-color: #f9f9f9;
}
.page-item.active .page-link {
  background-color: #3aaed8;
  color: white;
}
</style>