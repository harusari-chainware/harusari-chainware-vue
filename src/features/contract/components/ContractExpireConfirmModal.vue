<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h2 class="modal-title">만료 확인</h2>
      <p>거래처별 계약 제품을 만료 처리하시겠습니까?</p>
      <div class="modal-actions">
        <button @click="emit('close')">취소</button>
        <button @click="handleExpire">만료</button>
      </div>
    </div>
  </div>

  <!-- 완료 모달 -->
  <ContractDoneModal
      v-if="doneModal.show"
      :type="doneModal.type"
      @close="doneModal.show = false"
  />

  <ContractErrorModal
      v-if="ErrorOpen"
      :message="ErrorMsg"
      @close="ErrorOpen = false"
  />
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ContractErrorModal from "@/features/contract/components/ContractErrorModal.vue"
import ContractDoneModal from "@/features/contract/components/ContractDoneModal.vue"
import { updateContract } from "@/features/contract/api.js"   // 만료 처리 API

const props = defineProps({
  contractId: Number,
})

const emit = defineEmits(['close', 'expired'])

const ErrorOpen = ref(false)
const ErrorMsg = ref('')

// 완료 모달 상태
const doneModal = ref({
  show: false,
  type: 'expire'
})

const handleExpire = async () => {
  try {
    await updateContract(props.contractId, { contractStatus: 'EXPIRED' })
    emit('expired')
    emit('close')
    doneModal.value = { show: true, type: 'expire' }
  } catch (e) {
    ErrorMsg.value = (e?.response?.data?.message)
        ? e.response.data.message
        : '만료 처리에 실패했습니다. 서버 오류'
    ErrorOpen.value = true
    emit('close')
  }
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
  padding: 38px 28px 28px 28px;
  width: 100%;
  max-width: 380px;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(87, 135, 255, 0.11), 0 2px 8px rgba(40,40,40,0.06);
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
.modal-box p {
  color: #282b32;
  font-size: 1.01rem;
  margin-bottom: 7px;
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
    padding: 17px 7px 17px 7px;
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
