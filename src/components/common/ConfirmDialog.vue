<script setup>
defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '확인'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="onCancel">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn cancel" @click="onCancel">{{ cancelText }}</button>
        <button class="btn confirm" @click="onConfirm">{{ confirmText }}</button>
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
  max-width: 420px;
  padding: 24px 28px;
}
.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2d3d;
  margin: 0;
}
.modal-body {
  margin-top: 14px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}
.modal-body p {
  font-size: 15px;
  color: #4b5563;
  margin: 0;
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
  transition: all 0.2s;
  cursor: pointer;
  border: none;
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
.btn.confirm:hover {
  background-color: #2c9cc3;
}
</style>
