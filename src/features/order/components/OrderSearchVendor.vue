<template>
  <GenericSearchTable type="vendor" :multi="true" @select="items => emit('select', items)" />
</template>

<script setup>
import GenericSearchTable from '@/components/common/GenericSearchTable.vue'

const emit = defineEmits(['select'])
</script>
