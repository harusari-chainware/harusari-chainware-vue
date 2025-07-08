<template>
  <GenericSearchTable type="warehouse" @select="item => emit('select', item)" />
</template>

<script setup>
import GenericSearchTable from "@/components/common/GenericSearchTable.vue";

const emit = defineEmits(['select'])
</script>
