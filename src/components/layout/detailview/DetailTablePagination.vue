<!-- DetailTablePagination.vue -->
<template>
  <div class="pagination-wrapper">
    <Pagination
        :model-value="modelValue"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        @update:modelValue="onPageChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Pagination from '@/components/common/Pagination.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue'])

const internalPage = ref(props.modelValue)

// props가 변경되면 내부 값도 반영 (부모 → 자식)
watch(() => props.modelValue, (newVal) => {
  internalPage.value = newVal
})

// 내부에서 바뀌면 emit (자식 → 부모)
watch(internalPage, (newVal) => {
  emit('update:modelValue', newVal)
})

const onPageChange = (page) => {
  emit('update:modelValue', page)
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>
