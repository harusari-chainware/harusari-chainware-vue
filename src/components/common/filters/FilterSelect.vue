<template>
  <div class="filter-group">
    <label class="filter-label">{{ label }}</label>
    <select
        class="filter-select"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">전체</option>
      <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: {
    type: Array,
    required: true
  },
  modelValue: String
})


defineEmits(['update:modelValue'])
</script>

<style scoped>
@import '@/assets/css/filter-common.css';
</style>
