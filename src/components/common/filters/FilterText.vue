<template>
  <div class="filter-group">
    <label class="filter-label" :for="id">{{ label }}</label>
    <input
        :id="id"
        type="text"
        class="filter-input"
        :placeholder="placeholder"
        v-model="modelValueProxy"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `filter-text-${Math.random().toString(36).substring(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
@import '@/assets/css/filter-common.css';
</style>
