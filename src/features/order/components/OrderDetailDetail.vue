<template>
  <DetailTable
      title="주문 상세 제품"
      :items="items"
      :columns="columns"
  >
    <template #cell-index="{ index }">
      {{ index + 1 }}
    </template>
    <template #cell-unitPrice="{ value }">
      {{ formatCurrency(value) }}
    </template>
    <template #cell-totalPrice="{ value }">
      {{ formatCurrency(value) }}
    </template>
    <template #cell-storeType="{ value }">
      <StatusBadge :status="value" />
    </template>
  </DetailTable>
</template>

<script setup>
import DetailTable from '@/components/layout/detailview/DetailTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatCurrency } from '@/utils/tableUtils'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

const columns = [
  {key: 'index', label: 'No', align: 'center'},
  {key: 'productCode', label: '제품코드', align: 'center'},
  {key: 'productName', label: '제품명'},
  {key: 'unitQuantity', label: '제품 단위 숫자', align: 'center'},
  {key: 'unitSpec', label: '제품 단위 규격', align: 'center'},
  {key: 'storageType', label: '보관방식', align: 'center'},
  {key: 'contractPrice', label: '단가', align: 'right'},
  {key: 'quantity', label: '주문 수량', align: 'center'},
  {key: 'amount', label: '주문 금액', align: 'right'}
]
</script>
