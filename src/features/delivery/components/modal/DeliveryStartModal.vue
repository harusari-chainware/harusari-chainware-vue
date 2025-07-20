<template>
  <div class="modal-backdrop">
    <div class="modal-box large">
      <h2 class="modal-title">배송 시작</h2>
      <p>택배사를 입력하고 유통기한을 설정해주세요.</p>

      <!-- 택배사 입력 -->
      <div class="inline-field">
        <label for="carrier">택배사</label>
        <input
            id="carrier"
            v-model="carrier"
            type="text"
            placeholder="예: CJ대한통운"
        />
      </div>

      <!-- 제품 목록 & 유통기한 -->
      <DetailTable
          v-if="!isRedelivery"
          title="배송 제품 목록"
          :columns="columns"
          :items="editableProducts"
      >
        <template #cell-index="{ index }">
          {{ index + 1 }}
        </template>

        <template #cell-unit="{ item }">
          {{ item.unitQuantity }}{{ item.unitSpec }}
        </template>

        <template #cell-expirationDate="{ item }">
          <DatePickerField
              v-model="item.expirationDate"
              :id="`exp-${item.orderDetailId}`"
              label=""
              placeholder="유통기한 선택"
              :min-date="new Date()"
          />
        </template>
      </DetailTable>

      <!-- 하단 버튼 -->
      <div class="modal-actions">
        <StatusButton type="default" @click="$emit('close')">취소</StatusButton>
        <StatusButton type="approve" :disabled="!carrier" @click="handleStart">
          배송 시작
        </StatusButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, reactive, ref} from 'vue'
import StatusButton from '@/components/common/StatusButton.vue'
import DetailTable from '@/components/layout/detailview/DetailTable.vue'
import DatePickerField from '@/components/common/fields/DatePickerField.vue'
import { startDelivery } from '@/features/delivery/api.js'
import { useToast } from 'vue-toastification'
import {useAuthStore} from "@/features/auth/useAuthStore.js";

const authStore = useAuthStore()
const userRole = computed(() => authStore.authority || '')
//console.log('모달창 유저 권한:', userRole.value)

const props = defineProps({
  deliveryId: Number,
  isRedelivery: Boolean,
  products: Array
})

const emit = defineEmits(['close', 'started'])

const carrier = ref('')
const toast = useToast()

const editableProducts = reactive(
    props.products.map(p => ({
      ...p,
      expirationDate: ''
    }))
)

const columns = [
  {key: 'index', label: 'No', align: 'center'},
  {key: 'productCode', label: '제품코드'},
  {key: 'productName', label: '제품명'},
  {key: 'unit', label: '단위', align: 'center'},
  {key: 'quantity', label: '수량', align: 'center'},
  {key: 'expirationDate', label: '유통기한', align: 'center'}
]

const handleStart = async () => {
  try {
    await startDelivery(props.deliveryId, {
      carrier: carrier.value,
      products: editableProducts.map(p => ({
        orderDetailId: p.orderDetailId,
        takeBackDetailId: p.takeBackDetailId || null,
        expirationDate: p.expirationDate || null
      }))
    })
    toast.success('배송이 시작되었습니다.')
    emit('started')
    emit('close')
  } catch (e) {
    toast.error('배송 시작 실패: ' + (e.response?.data?.message || e.message))
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

.modal-box.large {
  background: white;
  padding: 28px;
  max-width: 680px;
  width: 95%;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(16, 185, 129, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 14px;
  color: #065f46;
}

.inline-field {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.inline-field label {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  min-width: 64px;
}

.inline-field input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 2.2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
