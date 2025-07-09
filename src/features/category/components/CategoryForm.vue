<template>
  <div :class="isModal ? 'modal-backdrop' : 'form-wrapper'">
    <div :class="isModal ? 'modal-box' : 'form-box'">
      <h2 class="modal-title">
        {{ isEdit ? (isTop ? '상위 카테고리 수정' : '카테고리 수정') : (isTop ? '상위 카테고리 등록' : '카테고리 등록') }}
      </h2>

      <!-- 상위 카테고리 선택 (하위 카테고리 등록/수정 시) -->
      <select
          v-if="!isTop"
          v-model="selectedTopCategoryId"
          class="modal-input"
      >
        <option disabled value="">상위 카테고리를 선택하세요</option>
        <option
            v-for="top in topCategories"
            :key="top.topCategoryId"
            :value="top.topCategoryId"
        >
          {{ top.topCategoryName }}
        </option>
      </select>

      <!-- 카테고리 이름 -->
      <input
          v-model="name"
          class="modal-input"
          placeholder="카테고리 이름을 입력하세요"
      />

      <!-- 카테고리 코드 -->
      <input
          v-if="!isTop"
          v-model="code"
          class="modal-input"
          placeholder="카테고리 코드를 입력하세요 (예: AB)"
          maxlength="2"
      />

      <div class="modal-actions">
        <button @click="emitCancel">취소</button>
        <button @click="handleSubmit">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  createCategory,
  updateCategory,
  createTopCategory,
  updateTopCategory,
} from '@/features/category/api.js'

const props = defineProps({
  isTop: { type: Boolean, default: false },
  isModal: { type: Boolean, default: true },
  topEditData: { type: Object, default: null },
  categoryEditData: { type: Object, default: null },
  topCategoryId: { type: Number, default: null },
  topCategories: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'refresh', 'submitted', 'cancelled'])

const isEdit = computed(() => !!props.topEditData || !!props.categoryEditData)
const name = ref('')
const code = ref('')
const selectedTopCategoryId = ref('')

// 자동 대문자 변환
watch(code, (val) => {
  code.value = val.toUpperCase()
})

// 초기값 세팅
watch(
    [() => props.topEditData, () => props.categoryEditData, () => props.topCategoryId],
    ([top, cat, topId]) => {
      name.value = top?.topCategoryName || cat?.categoryName || ''
      code.value = cat?.categoryCode || ''
      selectedTopCategoryId.value = cat?.topCategoryId || topId || ''
    },
    { immediate: true }
)

const emitCancel = () => {
  props.isModal ? emit('close') : emit('cancelled')
}

const handleSubmit = async () => {
  if (!name.value.trim()) {
    alert('카테고리 이름을 입력해주세요.')
    return
  }

  if (!props.isTop) {
    if (!selectedTopCategoryId.value) {
      alert('상위 카테고리를 선택해주세요.')
      return
    }
    if (!/^[A-Z]{2}$/.test(code.value)) {
      alert('카테고리 코드는 대문자 2자리여야 합니다. 예: AB')
      return
    }
  }

  try {
    if (isEdit.value) {
      if (props.isTop) {
        await updateTopCategory(props.topEditData.topCategoryId, {
          topCategoryName: name.value
        })
      } else {
        await updateCategory(props.categoryEditData.categoryId, {
          topCategoryId: selectedTopCategoryId.value,
          categoryName: name.value,
          categoryCode: code.value
        })
      }
    } else {
      if (props.isTop) {
        await createTopCategory({ topCategoryName: name.value })
      } else {
        await createCategory({
          topCategoryId: selectedTopCategoryId.value,
          categoryName: name.value,
          categoryCode: code.value
        })
      }
    }

    props.isModal ? emit('refresh') || emit('close') : emit('submitted')
  } catch (err) {
    console.error('❌ 등록/수정 실패:', err)
    if (err.response?.status === 409) {
      alert('이미 존재하는 카테고리입니다.')
    } else {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  background: #f5f6fa;
}

.form-box,
.modal-box {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(80, 88, 130, 0.08), 0 1.5px 4px rgba(0,0,0,0.03);
  padding: 32px 28px 24px 28px;
  margin: 48px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #23233c;
  letter-spacing: -0.02em;
}

.modal-input {
  width: 100%;
  border: 1.2px solid #e4e7ee;
  background: #fafbfc;
  border-radius: 8px;
  font-size: 1rem;
  padding: 12px 14px;
  margin-bottom: 16px;
  transition: border 0.18s;
}

.modal-input:focus {
  outline: none;
  border-color: #3aaed8;
  background: #fff;
}

select.modal-input {
  color: #23233c;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 4px;
}

.modal-actions button {
  min-width: 84px;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
}

.modal-actions button:first-child {
  background: #f4f5fa;
  color: #6e7180;
}

.modal-actions button:last-child {
  background: #3aaed8;
  color: #fff;
}

.modal-actions button:last-child:hover {
  background: #3aaed8;
}

.modal-actions button:first-child:hover {
  background: #e4e7ee;
}

@media (max-width: 540px) {
  .form-box, .modal-box {
    padding: 18px 10px;
    min-width: 0;
    width: 98vw;
  }
  .modal-title {
    font-size: 1.07rem;
    margin-bottom: 16px;
  }
}
</style>
