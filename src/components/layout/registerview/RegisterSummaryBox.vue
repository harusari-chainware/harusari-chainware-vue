
<template>
  <div class="summary-box">
    <div><strong>총 항목 수:</strong> {{ totalItems }}</div>
    <div><strong>총 수량:</strong> {{ totalQuantity }}</div>
    <div><strong>총 금액:</strong> {{ formatCurrency(totalAmount) }}</div>
  </div>
</template>

<script setup>
import { formatCurrency } from "@/utils/tableUtils.js";

const props = defineProps({
  totalItems: Number,
  totalQuantity: Number,
  totalAmount: Number
})
</script>

<style scoped>
.summary-box {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--color-gray-800);
  font-weight: 500;
}
</style>