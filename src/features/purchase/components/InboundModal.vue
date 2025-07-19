<template>
  <div class="modal-wrapper">
    <div class="modal-content">
      <h2 class="modal-title">입고 처리</h2>
      <p class="modal-desc">유통기한을 입력한 후 입고를 완료하세요. (오늘 이후만 선택 가능)</p>

      <div class="product-list">
        <div v-for="(item, idx) in localItems" :key="item.purchaseOrderDetailId" class="item-row">
          <span class="product-name">{{ item.productName }}</span>
          <input
              class="flat-input"
              ref="inputRefs"
              :data-index="idx"
              :placeholder="'유통기한 선택'"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn cancel" @click="$emit('cancel')">취소</button>
        <button class="btn primary" @click="submit">입고 완료</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, toRaw } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

const props = defineProps({
  items: Array
})

const emit = defineEmits(['submit', 'cancel'])

const localItems = reactive(props.items.map(item => ({
  purchaseOrderDetailId: item.purchaseOrderDetailId,
  productName: item.productName,
  expirationDate: ''
})))

const inputRefs = ref([])

onMounted(async () => {
  await nextTick()
  inputRefs.value = document.querySelectorAll('.flat-input')
  inputRefs.value.forEach((el, idx) => {
    flatpickr(el, {
      dateFormat: 'Y-m-d',
      minDate: 'today',
      onChange: function (selectedDates) {
        localItems[idx].expirationDate = selectedDates[0]?.toISOString().slice(0, 10) || ''
      }
    })
  })
})

const submit = () => {
  const hasEmpty = localItems.some(i => !i.expirationDate)
  if (hasEmpty) {
    alert('모든 품목의 유통기한을 입력해주세요.')
    return
  }
  emit('submit', toRaw(localItems))
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 500px;
  font-family: 'SUIT', sans-serif;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.modal-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #1f2d3d;
  margin-bottom: 0.5rem;
}
.modal-desc {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}
.product-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-name {
  font-size: 0.95rem;
  color: #1f2d3d;
}
.flat-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.9rem;
  width: 180px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}
.btn.cancel {
  background-color: #e5e7eb;
  color: #374151;
}
.btn.primary {
  background-color: #3aaed8;
  color: white;
}
</style>
