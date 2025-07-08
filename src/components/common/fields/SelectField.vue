<template>
  <div class="select-field">
    <label class="field-label" :for="id">{{ label }}</label>
    <select
        :id="id"
        v-model="modelValue"
        class="field-select"
    >
      <option disabled value="">선택해주세요</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  modelValue: String,
  options: Array,
  id: String
})

const emit = defineEmits(['update:modelValue'])
const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
</script>

<style scoped>
.select-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.field-select {
  padding: 0.5rem;
  font-size: var(--font-info-value);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-gray-50);
  color: var(--color-gray-900);
}
</style>
