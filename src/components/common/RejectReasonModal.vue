<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop">
      <div class="modal-box">
        <h2 class="modal-title">{{ title }}</h2>
        <textarea
            v-model="reason"
            placeholder="반려 사유를 입력해주세요."
            class="modal-textarea"
        ></textarea>

        <div class="modal-actions">
          <button @click="emit('update:modelValue', false)">취소</button>
          <button @click="handleConfirm">확인</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '반려 사유 입력'
  }
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const reason = ref('')
watch(() => props.modelValue, (val) => {
  if (val) reason.value = ''
})

const handleConfirm = () => {
  if (!reason.value.trim()) {
    alert('반려 사유를 입력해주세요.')
    return
  }
  emit('confirm', reason.value.trim())
  emit('update:modelValue', false)
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
  padding: 38px 28px 28px;
  width: 100%;
  max-width: 420px;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(255, 87, 87, 0.11), 0 2px 8px rgba(40,40,40,0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ff6363;
  margin-bottom: 17px;
  letter-spacing: -0.01em;
  text-align: left;
}

.modal-textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: none;
  color: #1f2d3d;
  background: #fafafa;
}

.modal-textarea:focus {
  outline: none;
  border-color: #ff6363;
  background: #fff;
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

@media (max-width: 540px) {
  .modal-box {
    padding: 17px 7px;
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
