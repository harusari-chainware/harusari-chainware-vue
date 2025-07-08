<template>
  <GenericSearchTable
      type="product"
      :multi="true"
      v-model:selected="selected"
      @select="emit('select', $event)"
  />
</template>

<script setup>
import {ref} from "vue";
import GenericSearchTable from '@/components/common/GenericSearchTable.vue'

const selected = ref([])
const emit = defineEmits(['select'])
</script>
