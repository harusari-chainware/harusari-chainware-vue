<!-- components/requisition/register/RequisitionRegisterDetail.vue -->
<script setup>
const props = defineProps({
  items: Array // [{ contractId, productId, productName, quantity, unitPrice, totalPrice }]
})
const emit = defineEmits(['removeItem'])

// 삭제 요청
const removeItem = (index) => {
  emit('removeItem', index)
}
</script>

<template>
  <div class="detail-section">
    <h3>품의 상세 리스트</h3>
    <table class="requisition-table">
      <thead>
      <tr>
        <th>제품명</th>
        <th>계약단가</th>
        <th>수량</th>
        <th>총 금액</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in props.items" :key="`${item.productId}-${index}`">
        <td>{{ item.productName }}</td>
        <td>{{ item.unitPrice.toLocaleString() }}원</td>
        <td>{{ item.quantity }}</td>
        <td>{{ (item.unitPrice * item.quantity).toLocaleString() }}원</td>
        <td>
          <button @click="removeItem(index)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
