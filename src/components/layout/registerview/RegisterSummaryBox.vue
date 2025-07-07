<template>
  <div class="summary-box">
    <slot name="summary">
      <div><strong>총 항목 수:</strong> 0</div>
      <div><strong>총 수량:</strong> 0</div>
      <div><strong>총 금액:</strong> 0원</div>
    </slot>
  </div>
</template>

<script setup>
// 슬롯 기반 공통 요약 상자
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