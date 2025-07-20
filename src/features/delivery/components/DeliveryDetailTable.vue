<template>
  <DetailTable
      :title="tableTitle"
      :columns="columns"
      :items="items"
  >
    <template #cell-index="{ index }">
      {{ index + 1 }}
    </template>

    <template #cell-unit="{ item }">
      {{ item.unitQuantity }}{{ item.unitSpec }}
    </template>

    <template #cell-storeType="{ value }">
      <StatusBadge :status="value" />
    </template>

    <template #cell-unitPrice="{ value }">
      {{ formatCurrency(value) }}
    </template>

    <template #cell-quantity="{ value }">
      {{ formatAmount(value) }}
    </template>

    <template #cell-amount="{ value }">
      {{ formatCurrency(value) }}
    </template>

    <template v-if="isRedelivery" #cell-takeBackReason="{ value }">
      {{ value || '-' }}
    </template>

    <template v-if="isRedelivery" #cell-takeBackImage="{ value }">
      <img v-if="value" :src="value" alt="반품 이미지" class="w-10 h-10 rounded-md" />
      <span v-else>-</span>
    </template>
  </DetailTable>
</template>

<script setup>
import DetailTable from '@/components/layout/detailview/DetailTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatAmount, formatCurrency } from '@/utils/tableUtils'

const props = defineProps({
  isRedelivery: Boolean,
  products: Array,
  takeBackProducts: Array
})

const items = props.isRedelivery ? props.takeBackProducts : props.products
const tableTitle = props.isRedelivery ? '반품 상세 제품' : '배송 상세 제품'

const columns = props.isRedelivery
    ? [
      { key: 'index', label: 'No', align: 'center' },
      { key: 'productCode', label: '제품코드' },
      { key: 'productName', label: '제품명' },
      { key: 'unit', label: '단위', align: 'center' },
      { key: 'storeType', label: '보관 방식', align: 'center' },
      { key: 'quantity', label: '반품 수량', align: 'center' },
      { key: 'price', label: '반품 금액', align: 'right' },
      { key: 'takeBackReason', label: '반품 사유' },
      { key: 'takeBackImage', label: '반품 이미지', align: 'center' }
    ]
    : [
      { key: 'index', label: 'No', align: 'center' },
      { key: 'productCode', label: '제품코드' },
      { key: 'productName', label: '제품명' },
      { key: 'unit', label: '단위', align: 'center' },
      { key: 'storeType', label: '보관 방식', align: 'center' },
      { key: 'unitPrice', label: '단가', align: 'right' },
      { key: 'quantity', label: '수량', align: 'center' },
      { key: 'amount', label: '금액', align: 'right' }
    ]
</script>
