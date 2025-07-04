<template>
  <div class="select-wrapper">
    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="styled-select"
    >
      <option value="asc">오름차순</option>
      <option value="desc">내림차순</option>
    </select>
    <span class="arrow">&#9662;</span>
  </div>
</template>

<script setup>
defineProps({ modelValue: String })
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
  font-size: 14px;
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
  font-size: 12px;
  color: var(--color-gray-600);
}
</style>
