<template>
  <div class="filter-buttons">
    <button class="btn btn-secondary" @click="$emit('reset')">초기화</button>
    <button class="btn btn-primary" @click="$emit('apply')">검색</button>
  </div>
</template>

<script setup>
// 단순 이벤트만 emit
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}
.btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color:	var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: #2c9cc3;
}

.btn-secondary {
  background-color: var(--color-gray-200);
  color: var(--color-gray-900);
}

.btn-secondary:hover {
  background-color: var(--color-gray-400);
}
</style>