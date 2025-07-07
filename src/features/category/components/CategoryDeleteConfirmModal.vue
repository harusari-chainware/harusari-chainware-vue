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
import { deleteCategory, deleteTopCategory } from '@/api/categoryApi'

const props = defineProps({
  targetId: Number,
  isTop: Boolean
})

const emit = defineEmits(['close', 'deleted'])

const handleDelete = async () => {
  try {
    if (props.isTop) {
      await deleteTopCategory(props.targetId)
    } else {
      await deleteCategory(props.targetId)
    }
    emit('deleted')
    emit('close')
    alert('삭제 완료!')
  } catch (e) {
    alert('삭제 실패: ' + (e?.response?.data?.message ?? '서버 오류'))
    emit('close')
  }
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
