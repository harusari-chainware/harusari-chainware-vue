<template>
  <div class="filter-group">
    <label class="filter-label">{{ label }}</label>
    <input
        ref="input"
        class="filter-date"
        type="text"
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
      if (selectedDate) {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        emit('update:modelValue', `${year}-${month}-${day}`)
      } else {
        emit('update:modelValue', '')
      }
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
@import '@/assets/css/filter-common.css';
</style>