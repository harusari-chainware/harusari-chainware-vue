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
      alert('수정이 완료되었습니다.')
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
      alert('등록이 완료되었습니다.')
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
  background: rgba(45, 53, 81, 0.17); /* 더 세련된 블러 느낌 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  padding: 36px 28px 24px 28px;
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 4px 20px 0 rgba(58, 174, 216, 0.13), 0 1.5px 6px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}

.modal-title {
  font-size: 1.23rem;
  font-weight: 700;
  color: #23233c;
  letter-spacing: -0.02em;
  margin-bottom: 30px;
}

.modal-input {
  width: 100%;
  border: 1.4px solid #e4e7ee;
  background: #fafbfc;
  border-radius: 8px;
  font-size: 1rem;
  padding: 13px 15px;
  margin-bottom: 18px;
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
  gap: 12px;
  margin-top: 6px;
}
.modal-actions button {
  min-width: 82px;
  border: none;
  border-radius: 7px;
  padding: 11px 0;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  background: #f4f5fa;
  color: #53536a;
  transition: background 0.15s, color 0.12s;
}
.modal-actions button:last-child {
  background: #3aaed8;
  color: #fff;
}
.modal-actions button:last-child:hover {
  background: #1196cd;
}
.modal-actions button:first-child:hover {
  background: #e4e7ee;
}

/* 반응형 */
@media (max-width: 600px) {
  .modal-box {
    padding: 16px 6px 16px 6px;
    min-width: 0;
    width: 98vw;
    border-radius: 9px;
  }
  .modal-title {
    font-size: 1.09rem;
    margin-bottom: 18px;
  }
  .modal-input {
    font-size: 0.97rem;
    padding: 11px 10px;
    margin-bottom: 14px;
  }
  .modal-actions button {
    font-size: 0.98rem;
    min-width: 70px;
    padding: 8px 0;
  }
}
</style>
