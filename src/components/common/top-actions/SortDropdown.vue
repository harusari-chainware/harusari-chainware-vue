<template>
  <div class="select-wrapper">
    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="styled-select"
    >
      <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span class="arrow">&#9662;</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.select-wrapper {
  position: relative;
  display: inline-block;
  width: 120px;
}

.styled-select {
  width: 100%;
  padding: 8px 30px 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: var(--font-dropdown);
  background-color: white;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  pointer-events: none;
  transform: translateY(-50%);
  font-size: var(--font-dropdown);
  color: var(--color-gray-600);
}
</style>