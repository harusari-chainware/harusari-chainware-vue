<template>
  <GenericSearchTable
      type="product"
      :multi="true"
      v-model:selected="selected"
      @select="submit"
  />
</template>

<script setup>
import {ref} from 'vue'
import GenericSearchTable from '@/components/common/GenericSearchTable.vue'

const selected = ref([])

const emit = defineEmits(['select'])

function submit() {
  emit('select', selected.value)
}
</script>
