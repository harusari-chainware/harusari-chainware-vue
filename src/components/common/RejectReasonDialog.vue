<script setup>
import { ref, watch } from 'vue'

defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '반려 사유 입력'
  }
})

const emit = defineEmits(['submit', 'cancel'])

const reason = ref('')

watch(() => reason.value, (newVal) => {
  if (newVal.length > 255) {
    reason.value = newVal.slice(0, 255)
  }
})

const handleSubmit = () => {
  if (reason.value.trim()) {
    emit('submit', reason.value.trim())
    reason.value = ''
  }
}

const handleCancel = () => {
  emit('cancel')
  reason.value = ''
}
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="handleCancel">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>
      <div class="modal-body">
        <textarea
            v-model="reason"
            placeholder="반려 사유를 입력해주세요 (최대 255자)"
            rows="5"
        ></textarea>
        <p class="char-count">{{ reason.length }}/255</p>
      </div>
      <div class="modal-footer">
        <button class="btn cancel" @click="handleCancel">취소</button>
        <button class="btn confirm" :disabled="!reason.trim()" @click="handleSubmit">
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 45, 61, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 460px;
  padding: 24px 28px;
}
.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2d3d;
  margin: 0;
}
.modal-body {
  margin-top: 16px;
}
.modal-body textarea {
  width: 100%;
  font-size: 14px;
  padding: 12px;
  resize: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: 'Malgun Gothic', 'Noto Sans KR', sans-serif;
  color: #1f2d3d;
}
.char-count {
  text-align: right;
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
.btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.btn.cancel {
  background-color: #f3f4f6;
  color: #1f2d3d;
}
.btn.cancel:hover {
  background-color: #e5e7eb;
}
.btn.confirm {
  background-color: #3aaed8;
  color: white;
}
.btn.confirm:disabled {
  background-color: #bcdff0;
  cursor: not-allowed;
}
.btn.confirm:hover:not(:disabled) {
  background-color: #2c9cc3;
}
</style>
