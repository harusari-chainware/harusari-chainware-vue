<template>
  <div class="textarea-field">
    <label class="field-label" :for="id">{{ label }}</label>
    <textarea
        :id="id"
        :placeholder="placeholder"
        v-model="modelValue"
        class="field-textarea"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  id: String
})

const emit = defineEmits(['update:modelValue'])
const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
</script>

<style scoped>
.textarea-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.field-textarea {
  padding: 0.5rem;
  font-size: var(--font-info-value);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-gray-50);
  color: var(--color-gray-900);
  resize: vertical;
  min-height: 100px;
}
</style>
