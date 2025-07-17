<template>
  <div class="search-field">
    <label class="field-label" :for="id">{{ label }}</label>
    <div class="search-row">
      <input
          :id="id"
          type="text"
          v-model="modelValue"
          :placeholder="placeholder"
          class="field-input"
      />
      <!-- readonly -->
      <StatusButton type="primary" @click="$emit('search')">검색</StatusButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusButton from "@/components/common/StatusButton.vue";
const props = defineProps({
  label: String,
  modelValue: String,
  placeholder: String,
  id: String
})

const emit = defineEmits(['update:modelValue', 'search'])
const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
</script>

<style scoped>
.search-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.search-row {
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
</style>
