<template>
  <div class="address-search-field">
    <label class="field-label">{{ label }}</label>
    <div class="address-row">
      <input
          type="text"
          v-model="modelValue"
          placeholder="주소 검색"
          readonly
          class="field-input"
      />
      <button class="btn-search" @click="$emit('search')">주소 검색</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'search'])
const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
</script>

<style scoped>
.address-search-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.address-row {
  display: flex;
  gap: 0.5rem;
}

.field-input {
  flex: 1;
  padding: 0.5rem;
  font-size: var(--font-info-value);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-gray-50);
  color: var(--color-gray-900);
}

.btn-search {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-search:hover {
  background-color: var(--color-primary-dark);
}
</style>
