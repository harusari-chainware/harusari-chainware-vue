<template>
  <div class="filter-buttons">
    <StatusButton type="reset" @click="$emit('reset')">초기화</StatusButton>
    <StatusButton type="primary" @click="$emit('apply')">검색</StatusButton>
  </div>
</template>

<script setup>
import StatusButton from '@/components/common/StatusButton.vue'
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}
</style>