<!-- components/common/ConfirmModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay">
      <div class="modal">
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-description">{{ description }}</p>
        <div class="modal-actions">
          <button @click="emit('update:modelValue', false)">취소</button>
          <button @click="emit('confirm')">확인</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  description: String
})
const emit = defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
  animation: fadeIn 0.2s ease-in-out;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 12px;
}

.modal-description {
  font-size: 14px;
  color: #606f7b;
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-actions button:first-child {
  background-color: #e3e7eb;
  color: #1f2d3d;
}

.modal-actions button:first-child:hover {
  background-color: #d0d5da;
}

.modal-actions button:last-child {
  background-color: #3aaed8;
  color: white;
}

.modal-actions button:last-child:hover {
  background-color: #349fc8;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
