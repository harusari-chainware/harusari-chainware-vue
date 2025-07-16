<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">주문 취소</h2>
      <p>정말로 이 주문을 취소하시겠습니까?</p>

      <div class="modal-actions">
        <StatusButton type="default" @click="$emit('close')">아니오</StatusButton>
        <StatusButton type="reject" @click="handleConfirmCancel">예</StatusButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'
import { cancelOrder } from '@/features/order/api'
import StatusButton from "@/components/common/StatusButton.vue";

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'cancelled'])

const handleConfirmCancel = async () => {
  try {
    await cancelOrder(props.orderId)
    emit('cancelled')
    emit('close')
  } catch (e) {
    alert('주문 취소에 실패했습니다: ' + (e.response?.data?.message || e.message))
  }
}
</script>

<style scoped>
/* CategoryDeleteConfirmModal과 동일한 스타일 복붙 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(40, 50, 65, 0.19);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  padding: 38px 28px 28px 28px;
  max-width: 380px;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(255, 87, 87, 0.11), 0 2px 8px rgba(40,40,40,0.06);
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ff6363;
  margin-bottom: 17px;
}

.modal-box p {
  color: #282b32;
  font-size: 1.01rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 13px;
  margin-top: 2.3rem;
}
.modal-actions button {
  min-width: 86px;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  background: #f4f5fa;
  color: #6e7180;
  transition: background 0.16s, color 0.16s;
}
.modal-actions button:first-child:hover {
  background: #e4e7ee;
  color: #23233c;
}
.modal-actions button:last-child {
  background: #ff6363;
  color: #fff;
}
.modal-actions button:last-child:hover {
  background: #de3838;
}
</style>
