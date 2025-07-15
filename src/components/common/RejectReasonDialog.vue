<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop">
      <div class="modal">
        <h2>반려 사유</h2>
        <textarea v-model="reason" placeholder="사유를 입력하세요" />
        <div class="modal-actions">
          <button @click="submit">확인</button>
          <button @click="$emit('update:modelValue', false)">취소</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'confirm'])

const reason = ref('')

watch(() => props.modelValue, (visible) => {
  if (visible) reason.value = ''
})

const submit = () => {
  if (reason.value.trim()) {
    emit('confirm', reason.value)
    emit('update:modelValue', false)
  } else {
    alert('사유를 입력해주세요.')
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
}
.modal textarea {
  width: 100%;
  min-height: 100px;
  margin-top: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}
</style>
