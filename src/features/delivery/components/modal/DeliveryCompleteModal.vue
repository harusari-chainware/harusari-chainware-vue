<!-- features/delivery/components/modal/DeliveryCompleteModal.vue -->
<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">배송 완료</h2>
      <p>배송을 완료하시겠습니까?</p>

      <div class="modal-actions">
        <StatusButton type="default" @click="$emit('close')">취소</StatusButton>
        <StatusButton type="complete" @click="handleComplete">완료</StatusButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { completeDelivery } from '@/features/delivery/api.js'
import { useToast } from 'vue-toastification'
import StatusButton from '@/components/common/StatusButton.vue'

const props = defineProps({ deliveryId: Number })
const emit = defineEmits(['close', 'completed'])

const toast = useToast()

const handleComplete = async () => {
  try {
    await completeDelivery(props.deliveryId)
    toast.success('배송이 완료되었습니다.')
    emit('completed')
  } catch (e) {
    toast.error('배송 완료 실패: ' + (e.response?.data?.message || e.message))
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 24px;
  width: 400px;
  border-radius: 12px;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
