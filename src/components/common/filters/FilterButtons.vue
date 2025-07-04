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
  background-color: #3aaed8;
  color: white;
}

.btn-primary:hover {
  background-color: #2c9cc3;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2d3d;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>