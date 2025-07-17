<template>
  <RegisterDetailTable
      :title="title"
      :columns="columns"
      :items="items"
      @remove="item => emit('remove', item)"
      @add-product="() => emit('add-product')"
  >
    <!-- 우측 상단에 제품 추가 버튼 -->
    <template #actions>
      <StatusButton type="primary" @click="() => emit('add-product')">+ 제품 추가</StatusButton>
    </template>

    <!-- 수량 입력 -->
    <template #cell-quantity="{ item, index }">
      <input
          type="number"
          min="1"
          :value="item.quantity"
          @input="e => emit('update-item', index, 'quantity', +e.target.value)"
          class="input-small"
      />
    </template>

    <!-- 보관 방식 Badge 적용 -->
    <template #cell-storeType="{ item }">
      <StatusBadge :status="item.storeType" />
    </template>

    <!-- 단위 금액 currency 적용 -->
    <template #cell-unitPrice="{ item }">
      {{ formatCurrency(item.unitPrice) }}
    </template>

    <!-- 총 금액 표시 -->
    <template #cell-totalPrice="{ item }">
      {{ formatCurrency(item.unitPrice * item.quantity) }}
    </template>

    <!-- 삭제 버튼 -->
    <template #cell-actions="{ item }">
      <StatusButton type="danger" @click="() => emit('remove', item)">삭제</StatusButton>
    </template>
  </RegisterDetailTable>
</template>

<script setup>
import RegisterDetailTable from '@/components/layout/registerview/RegisterDetailTable.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatCurrency } from "@/utils/tableUtils.js";

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['remove', 'update-item', 'add-product'])

const title = "주문 상세"

const columns = [
  { key: 'productCode', label: '제품 코드' },
  { key: 'productName', label: '제품명' },
  { key: 'unit', label: '단위' },
  { key: 'storeType', label: '보관 방식' },
  { key: 'unitPrice', label: '단위 금액' },
  { key: 'quantity', label: '수량' },
  { key: 'totalPrice', label: '총 금액' },
  { key: 'actions', label: '' }
]
</script>

<style scoped>
.input-small {
  width: 60px;
}
</style>
