<template>
  <div class="date-picker-field">
    <label class="field-label" :for="id">{{ label }}</label>
    <input
        ref="input"
        type="text"
        :id="id"
        class="field-input"
        :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import '@/assets/css/flatpickr-custom.css'

const props = defineProps({
  label: String,
  modelValue: String,
  id: String,
  placeholder: {
    type: String,
    default: '날짜 선택'
  },
  minDate: {
    type: [String, Date],
    default: null // 전달 없으면 제한 없음
  }
})

const emit = defineEmits(['update:modelValue'])

const input = ref(null)
let fpInstance = null

onMounted(() => {
  fpInstance = flatpickr(input.value, {
    dateFormat: 'Y-m-d',
    defaultDate: props.modelValue || null,
    minDate: props.minDate || null,
    onChange: ([selectedDate]) => {
      emit('update:modelValue', selectedDate ? selectedDate.toISOString().split('T')[0] : '')
    }
  })
})

watch(() => props.modelValue, (newVal) => {
  if (fpInstance && newVal !== fpInstance.input.value) {
    fpInstance.setDate(newVal, false)
  }
})
</script>

<style scoped>
.date-picker-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.field-input {
  padding: 0.5rem;
  font-size: var(--font-info-value);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-gray-50);
  color: var(--color-gray-900);
  min-height: 2.2rem;
}
</style>
