<!-- components/common/GenericSearchButton.vue -->
<template>
  <button
      class="search-button"
      :class="buttonClass"
      :disabled="disabled"
      @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['click'])

function onClick(event) {
  emit('click', event)
}

const buttonClass = computed(() => {
  switch (props.type) {
    case 'selected':
      return 'btn-selected'
    case 'primary':
      return 'btn-primary'
    default:
      return ''
  }
})
</script>

<style scoped>
.search-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 25px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-selected {
  background-color: var(--color-gray-200);
  color: var(--color-gray-900);
}

.btn-selected.selected {
  background-color: var(--color-primary-dark);
  color: white;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}
</style>
