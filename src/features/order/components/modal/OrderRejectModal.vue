<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">주문 반려</h2>
      <p>정말로 이 주문을 반려하시겠습니까?</p>
      <textarea
          v-model="reason"
          placeholder="반려 사유를 입력하세요"
          class="modal-textarea"
      ></textarea>

      <div class="modal-actions">
        <StatusButton type="default" @click="$emit('close')">취소</StatusButton>
        <StatusButton type="reject" @click="handleReject">반려</StatusButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'
import { rejectOrder } from '@/features/order/api.js'
import StatusButton from "@/components/common/StatusButton.vue";

const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close', 'rejected'])
const reason = ref('')

const handleReject = async () => {
  if (!reason.value.trim()) {
    alert('반려 사유를 입력해주세요.');
    return;
  }
  try {
    await rejectOrder(props.orderId, { rejectReason: reason.value });
    emit('rejected');
    emit('close');
  } catch (e) {
    alert('주문 반려에 실패했습니다: ' + (e.response?.data?.message || e.message));
  }
}
</script>

<style scoped>
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
  max-width: 420px;
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
  margin-bottom: 12px;
}

.modal-textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  box-sizing: border-box;
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
