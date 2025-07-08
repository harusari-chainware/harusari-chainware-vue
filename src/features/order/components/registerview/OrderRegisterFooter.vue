<template>
  <RegisterFooter>
    <template #actions>
      <StatusButton type="primary" @click="submit">등록</StatusButton>
      <StatusButton type="reset" @click="cancel">취소</StatusButton>
    </template>
  </RegisterFooter>
</template>

<script setup>
import RegisterFooter from '@/components/layout/registerview/RegisterFooter.vue'
import StatusButton from "@/components/common/StatusButton.vue";

const submit = () => alert('등록 완료')
const cancel = () => alert('취소')
</script>