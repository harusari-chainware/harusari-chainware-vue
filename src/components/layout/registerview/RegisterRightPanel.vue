<template>
  <div class="right-panel">
    <div class="panel-title">{{ title }}</div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<style scoped>
.right-panel {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: var(--color-white);
  padding: 2rem;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: var(--font-page-title-small);
  font-weight: bold;
  color: var(--color-gray-700);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.75rem;
  margin-bottom: 10px;
}
</style>
