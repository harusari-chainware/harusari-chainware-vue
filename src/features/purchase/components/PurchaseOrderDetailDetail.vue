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

    <template #cell-moq="{ value }">
      {{ value ?? '-' }}
    </template>

    <template #cell-actions="{ item }">
      <StatusButton type="danger" @click="onDelete(item.productCode)">
        삭제
      </StatusButton>
    </template>

    <!-- 더보기 버튼으로 넘어가는 게 필요하다면 -->
    <template #footer>
      <DetailTableMoreLink to="/category/list" label="페이지 이동 확인" />
    </template>
  </DetailTable>
</template>

<script setup>
import DetailTable from '@/components/layout/detailview/DetailTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import DetailTableMoreLink from "@/components/layout/detailview/DetailTableMoreLink.vue";
import DetailTablePagination from "@/components/layout/detailview/DetailTablePagination.vue";
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
  { key: 'productName', label: '제품명', align: 'center' },
  { key: 'unitPrice', label: '계약 단가', align: 'center' },
  { key: 'moq', label: 'MOQ', align: 'center' },
  { key: 'quantity', label: '주문 수량', align: 'center' },
  { key: 'totalPrice', label: '총 금액', align: 'center' },
  { key: 'actions', label: '', align: 'center' }
]

// pagination 있다면
const emit = defineEmits(['update:page'])
const handlePageChange = (newPage) => {
  emit('update:page', newPage)
}

const onDelete = (productCode) => {
  alert(`제품 ${productCode} 삭제 요청`)
}
</script>
