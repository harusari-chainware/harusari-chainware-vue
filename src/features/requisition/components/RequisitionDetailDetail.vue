<template>
  <DetailTable
      title="품의 상세 품목"
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

    <template #footer>
      <DetailTableMoreLink to="/product/list" label="상품 목록 보기" />
    </template>
  </DetailTable>
</template>

<script setup>
import DetailTable from '@/components/layout/detailview/DetailTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import DetailTableMoreLink from '@/components/layout/detailview/DetailTableMoreLink.vue'
import { formatCurrency } from '@/utils/tableUtils'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const columns = [
  { key: 'index', label: 'No', align: 'center' },
  { key: 'productCode', label: '제품코드', align: 'center' },
  { key: 'productName', label: '제품명', align: 'left' },
  { key: 'unit', label: '단위', align: 'center' },
  { key: 'storeType', label: '보관 방식', align: 'center' },
  { key: 'unitPrice', label: '단가', align: 'right' },
  { key: 'quantity', label: '수량', align: 'center' },
  { key: 'totalPrice', label: '합계 금액', align: 'right' }
]
</script>
