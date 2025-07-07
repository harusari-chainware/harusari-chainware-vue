<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">어떤 카테고리를 등록할까요?</h2>
      <div class="modal-actions">
        <button @click="$emit('select', 'TOP')">상위 카테고리 등록</button>
        <button @click="$emit('select', 'SUB')">카테고리 등록</button>
        <button class="cancel" @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['select', 'close'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  width: 360px;
}

.modal-title {
  font-size: 18px;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

button {
  padding: 10px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

button:nth-child(1) {
  background-color: #3b82f6;
  color: white;
}

button:nth-child(2) {
  background-color: #10b981;
  color: white;
}

button.cancel {
  background-color: #ccc;
  color: black;
}
</style>
