<template>
  <RegisterDetailTable
      :title="title"
      :columns="columns"
      :items="items"
      @remove="index => emit('remove', index)"
      @add-product="() => emit('add-product')"
  >
    <!-- 제품 추가 버튼 -->
    <template #actions>
      <StatusButton type="primary" @click="() => emit('add-product')">+ 제품 추가</StatusButton>
    </template>

    <!-- 수량 입력 -->
    <template #cell-quantity="{ item, index }">
      <input
          type="number"
          :min="item.minOrderQty || 1"
          :value="item.quantity"
          @input="e => {
            const val = +e.target.value
            const safeVal = Math.max(val, item.minOrderQty || 1)
            emit('update-item', index, 'quantity', safeVal)
          }"
          class="input-small"
      />
    </template>

    <!-- 총 금액 표시 -->
    <template #cell-totalPrice="{ item }">
      {{ formatPrice((+item.contractPrice || 0) * (+item.quantity || 0)) }}
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

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['remove', 'update-item', 'add-product'])

const title = "주문 상세"

const columns = [
  { key: 'productName', label: '제품명' },
  { key: 'basePrice', label: '기준단가' },
  { key: 'contractPrice', label: '계약단가' },
  { key: 'minOrderQty', label: '최소주문수량' },
  { key: 'leadTime', label: '납기일(일)' },
  { key: 'quantity', label: '수량' },
  { key: 'totalPrice', label: '총 금액' },
  { key: 'actions', label: '' }
]

function formatPrice(value) {
  return typeof value === 'number' && !isNaN(value)
      ? new Intl.NumberFormat('ko-KR').format(value) + '원'
      : '0원'
}
</script>

<style scoped>
.input-small {
  width: 60px;
}
</style>
