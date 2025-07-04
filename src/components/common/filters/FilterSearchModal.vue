<template>
  <div class="filter-group">
    <label class="filter-label">{{ label }}</label>
    <div
        class="search-modal-trigger"
        tabindex="0"
        @click="$emit('open')"
    >
      <span>{{ displayText || '가맹점 선택' }}</span>
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  displayText: String
})

defineEmits(['open'])
</script>

<style scoped>
@import '@/assets/css/filter-common.css';
.search-modal-trigger {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-modal-trigger:hover {
  background-color: #f0f0f0;
}
</style>