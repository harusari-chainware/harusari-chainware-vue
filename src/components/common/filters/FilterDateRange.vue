<template>
  <div class="filter-group">
    <label class="filter-label">{{ label }}</label>
    <input
        ref="input"
        class="filter-date"
        type="text"
        placeholder="날짜 범위 선택"
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
  modelValue: Object // { start: '', end: '' }
})
const emit = defineEmits(['update:modelValue'])

const input = ref(null)
let fpInstance = null

onMounted(() => {
  fpInstance = flatpickr(input.value, {
    mode: 'range',
    dateFormat: 'Y-m-d',
    defaultDate: [props.modelValue?.start, props.modelValue?.end],
    onChange: (selectedDates) => {
      emit('update:modelValue', {
        start: selectedDates[0] ? selectedDates[0].toISOString().split('T')[0] : '',
        end: selectedDates[1] ? selectedDates[1].toISOString().split('T')[0] : ''
      })
    }
  })
})

watch(() => props.modelValue, (newVal) => {
  const {start, end} = newVal || {}
  if (fpInstance) {
    const currentDates = fpInstance.selectedDates.map(d => d.toISOString().split('T')[0])
    if (start !== currentDates[0] || end !== currentDates[1]) {
      fpInstance.setDate([start, end], false)
    }
  }
})
</script>

<style scoped>
@import '@/assets/css/filter-common.css';
</style>
