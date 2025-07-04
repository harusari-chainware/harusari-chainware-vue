<template>
  <button class="btn btn-create" @click="$emit('click')">
    <slot>신규 등록</slot>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.btn-create {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  background-color: var(--color-primary);
  color: white;
  transition: background-color 0.2s;
}
.btn-create:hover {
  background-color: #2c9cc3;
}
</style>