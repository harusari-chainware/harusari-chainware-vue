<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="emit('close')">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'register', // 'register' | 'edit' | 'delete'
    validator: v => ['register', 'edit', 'delete'].includes(v)
  }
})

const emit = defineEmits(['close'])

const titleMap = {
  register: '거래처별 계약 제품 등록 완료',
  edit: '거래처별 계약 제품 수정 완료',
  delete: '거래처별 계약 제품 삭제 완료'
}
const title = titleMap[props.type] ?? '완료'

const messageMap = {
  register: '거래처별 계약 제품이 성공적으로 등록되었습니다.',
  edit: '거래처별 계약 제품이 성공적으로 수정되었습니다.',
  delete: '거래처별 계약 제품이 성공적으로 삭제되었습니다.'
}
const message = messageMap[props.type] ?? '완료되었습니다.'
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
  width: 100%;
  max-width: 380px;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(74, 103, 200, 0.11), 0 2px 8px rgba(40,40,40,0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #3796ff;
  margin-bottom: 17px;
  letter-spacing: -0.01em;
  text-align: left;
}
.modal-box p {
  color: #282b32;
  font-size: 1.01rem;
  margin-bottom: 7px;
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
  background: #3796ff;
  color: #fff;
  transition: background 0.16s, color 0.16s;
}
.modal-actions button:hover {
  background: #226cd3;
}
@media (max-width: 540px) {
  .modal-box {
    padding: 17px 7px 17px 7px;
    min-width: 0;
    width: 96vw;
    border-radius: 9px;
  }
  .modal-title {
    font-size: 1.01rem;
    margin-bottom: 12px;
  }
  .modal-actions button {
    font-size: 0.97rem;
    min-width: 66px;
    padding: 8px 0;
  }
}
</style>
