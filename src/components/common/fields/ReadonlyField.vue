<template>
  <div class="readonly-field">
    <label class="field-label">{{ label }}</label>
    <div class="readonly-text">{{ value || '-' }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  value: [String, Number]
})
</script>

<style scoped>
.readonly-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: var(--font-info-value);
}

.field-label {
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: var(--font-info-label);
}

.readonly-text {
  padding: 0.5rem 0.75rem;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-info-value);
  color: var(--color-gray-900);
  min-height: 2.2rem;
  display: flex;
  align-items: center;
}
</style>