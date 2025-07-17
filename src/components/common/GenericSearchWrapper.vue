<template>
  <GenericSearchTable
      :type="type"
      :multi="multi"
      v-model:selected="selected"
      @select="emit('select', $event)"
  />
</template>

<script setup>
import GenericSearchTable from '@/components/common/GenericSearchTable.vue'
import {ref, watch} from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  multi: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'update:selected'])
const selected = ref([...props.selected])

watch(() => props.selected, val => {
  selected.value = [...val]
})
</script>