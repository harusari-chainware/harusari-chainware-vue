<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">알림</h2>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="emit('close')">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
const props = defineProps({ message: String })
const emit = defineEmits(['close'])

onMounted(() => {
  const handler = e => {
    if (e.key === 'Escape') emit('close')
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  background: transparent !important;
  inset: 0;
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
  color: #f8a203;
  margin-bottom: 17px;
  letter-spacing: -0.01em;
  text-align: left;
}
.modal-box p {
  color: #000;
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
  background: #f8a203;
  color: #fff;
  transition: background 0.16s, color 0.16s;
}
.modal-actions button:hover {
  background: #f8a203;
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
