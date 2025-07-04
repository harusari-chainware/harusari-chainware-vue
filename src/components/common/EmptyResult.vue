<template>
  <div class="empty-result">
    <i class="fa-solid fa-magnifying-glass empty-icon" aria-hidden="true"></i>
    <p class="empty-text">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: '검색 결과가 없습니다.'
  }
})
</script>

<style scoped>
.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--color-gray-600);
  border: 1px dashed var(--color-border);
  border-radius: 12px;
  background-color: #f9fafb;
  text-align: center;
}

.empty-icon {
  font-size: var(--font-empty-title);
  margin-bottom: 12px;
  color: #9ca3af;
}

.empty-text {
  font-size: var(--font-empty-text);
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
