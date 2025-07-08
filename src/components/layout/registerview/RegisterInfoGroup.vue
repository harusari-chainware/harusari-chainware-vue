<template>
  <div class="register-info-group">
    <div class="group-title">{{ title }}</div>
    <div class="group-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<style scoped>
.register-info-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.group-title {
  font-size: var(--font-page-title-small);
  font-weight: bold;
  color: var(--color-gray-700);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.75rem;
}

.group-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
</style>
