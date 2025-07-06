<template>
  <div :class="isModal ? 'modal-backdrop' : 'form-wrapper'">
    <div :class="isModal ? 'modal-box' : 'form-box'">
      <div style="color: red;">✅ 폼 렌더링됨 (isModal: {{ isModal }})</div>
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
} from '@/api/categoryApi'

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

console.log('✅ CategoryForm.vue 렌더링됨')

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
  height: 400px;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.form-box {
  margin: 100px auto;
  padding: 2rem;
  background: white;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
  border-radius: 10px;
  max-width: 600px;
}

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

.modal-input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
