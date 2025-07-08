<template>
  <RegisterFooter>
    <template #actions>
      <button class="btn-submit" @click="submit">등록</button>
      <button class="btn-cancel" @click="cancel">취소</button>
    </template>
  </RegisterFooter>
</template>

<script setup>
import RegisterFooter from '@/components/layout/registerview/RegisterFooter.vue'
import StatusButton from "@/components/common/StatusButton.vue";

const submit = () => alert('등록 완료')
const cancel = () => alert('취소')
</script>

<style scoped>
.btn-submit {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: var(--font-button);
  cursor: pointer;
}

.btn-cancel {
  background-color: var(--color-gray-400);
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: var(--font-button);
  cursor: pointer;
  margin-left: 0.5rem;
}
</style>