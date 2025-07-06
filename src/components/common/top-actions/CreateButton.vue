<template>
  <StatusButton type="primary" @click="$emit('click')">
    <slot>신규 등록</slot>
  </StatusButton>
</template>

<script setup>
import StatusButton from '../StatusButton.vue'
</script>