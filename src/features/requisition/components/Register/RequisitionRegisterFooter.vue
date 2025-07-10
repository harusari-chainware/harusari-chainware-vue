<!-- components/requisition/register/RequisitionRegisterFooter.vue -->
<script setup>
const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = () => {
  emit('submit')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="footer-wrapper">
    <button class="btn cancel" @click="handleCancel">취소</button>
    <button class="btn primary" @click="handleSubmit">등록</button>
  </div>
</template>
