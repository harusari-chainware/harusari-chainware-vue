<template>
  <RegisterFooter>
    <template #actions>
      <StatusButton type="primary" @click="emit('submit')">등록</StatusButton>
      <StatusButton type="reset" @click="emit('cancel')">취소</StatusButton>
    </template>
  </RegisterFooter>
</template>

<script setup>
import RegisterFooter from '@/components/layout/registerview/RegisterFooter.vue'
import StatusButton from "@/components/common/StatusButton.vue";

const emit = defineEmits(['submit', 'cancel'])
</script>