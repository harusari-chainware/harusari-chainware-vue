<template>
  <RegisterDetailTable
      :title="title"
      :columns="columns"
      :items="items"
      @remove="removeItem"
      @add-product="openProductModal"
  >
    <template #cell-totalPrice="{ item }">
      {{ formatPrice(item.unitPrice * item.quantity) }}
    </template>
  </RegisterDetailTable>
</template>

<script setup>
import { ref } from "vue";

import RegisterDetailTable from '@/components/layout/registerview/RegisterDetailTable.vue'

const title = "주문 상세"

const items = ref([
  { name: '제품 A', code: 'P001', unitPrice: 1000, moq: 5, quantity: 1 },
])

const columns = [
  { key: 'productCode', label: '제품 코드' },
  { key: 'productName', label: '제품명' },
  { key: 'unit', label: '단위' },
  { key: 'storeType', label: '보관 방식' },
  { key: 'unitPrice', label: '단위 금액' },
  { key: 'quantity', label: '수량' },
  { key: 'totalPrice', label: '총 금액' },
]

const removeItem = (index) => items.value.splice(index, 1)
const openProductModal = () => alert('제품 추가 모달')

function formatPrice(value) {
  return new Intl.NumberFormat('ko-KR').format(value) + '원'
}
</script>