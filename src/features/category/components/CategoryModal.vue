<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">
        {{ isEdit ? (isTop ? '상위 카테고리 수정' : '카테고리 수정') : (isTop ? '상위 카테고리 등록' : '카테고리 등록') }}
      </h2>

      <select
          v-if="!isTop"
          v-model="selectedTopCategoryId"
          class="modal-input"
      >
        <option disabled value="">상위 카테고리를 선택하세요</option>
<!--        <option-->
<!--            v-for="top in topCategories"-->
<!--            :key="top.topCategoryId"-->
<!--            :value="String(top.topCategoryId)"-->
<!--        >-->
<!--          {{ top.topCategoryName }}-->
<!--        </option>-->
        <option
            v-for="top in topCategories"
            :key="top.value"
            :value="top.value"
        >
          {{ top.label }}
        </option>
      </select>

      <!-- 카테고리 이름 -->
      <input
          v-model="name"
          class="modal-input"
          placeholder="카테고리 이름을 입력하세요"
      />

      <!-- 카테고리 코드 입력 -->
      <input
          v-if="!isTop"
          v-model="code"
          class="modal-input"
          placeholder="카테고리 코드를 입력하세요 (예: AB)"
          maxlength="2"
      />

      <div class="modal-actions">
        <button @click="emit('close')">취소</button>
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
  topEditData: { type: Object, default: null },
  categoryEditData: { type: Object, default: null },
  topCategoryId: { type: Number, default: null }, // 등록 시 외부에서 지정 가능
  topCategories: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'refresh'])

const isEdit = computed(() => !!props.topEditData || !!props.categoryEditData)

const name = ref('')
const code = ref('')

// 대문자 자동 변환
watch(code, (val) => {
  code.value = val.toUpperCase()
})
const selectedTopCategoryId = ref('')

// 상위 카테고리명 찾아주는 computed
// const selectedTopCategoryName = computed(() => {
//   const top = props.topCategories.find(tc => tc.topCategoryId === selectedTopCategoryId.value)
//   return top ? top.topCategoryName : ''
// })
const selectedTopCategoryName = computed(() => {
  const top = props.topCategories.find(tc => tc.value === selectedTopCategoryId.value)
  return top ? top.label : ''
})

// 초기값 세팅
watch(
    [() => props.topEditData, () => props.categoryEditData, () => props.topCategoryId],
    ([top, cat, topId]) => {
      name.value = top?.topCategoryName || cat?.categoryName || ''
      code.value = cat?.categoryCode || ''
      selectedTopCategoryId.value = cat?.topCategoryId !== undefined
          ? String(cat.topCategoryId)
          : (topId !== undefined ? String(topId) : '')
    },
    { immediate: true }
)
// watch(
//     [() => props.topEditData, () => props.categoryEditData, () => props.topCategoryId],
//     ([top, cat, topId]) => {
//       name.value = top?.topCategoryName || cat?.categoryName || ''
//       code.value = cat?.categoryCode || ''
//       // 반드시 문자열!
//       selectedTopCategoryId.value = cat?.topCategoryId !== undefined
//           ? String(cat.topCategoryId)
//           : (topId !== undefined ? String(topId) : '')
//     },
//     { immediate: true }
// )

const handleSubmit = async () => {
  if (!name.value.trim()) {
    alert('카테고리 이름을 입력해주세요.')
    return
  }

  if (!props.isTop) {
    if (selectedTopCategoryId.value) {
      if (!/^[A-Z]{2}$/.test(code.value)) {
        alert('카테고리 코드는 대문자 2자리여야 합니다. 예: AB')
        return
      }
    } else {
      alert('상위 카테고리를 선택해주세요.')
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

    emit('refresh')
    emit('close')
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
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
