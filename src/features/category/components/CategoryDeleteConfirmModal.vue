<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">삭제 확인</h2>
      <p>정말로 이 {{ isTop ? '상위 카테고리' : '카테고리' }}를 삭제하시겠습니까?</p>

      <div class="modal-actions">
        <button @click="emit('close')">취소</button>
        <button @click="handleDelete">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  targetId: Number,
  isTop: Boolean
})

const emit = defineEmits(['close', 'deleted'])

const handleDelete = async () => {
  // 실제 API 호출은 여기서 진행해야 함
  console.log('삭제 요청 ID:', props.targetId)
  emit('deleted')
  emit('close')
}
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
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 20px;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1.5rem;
}
</style>
