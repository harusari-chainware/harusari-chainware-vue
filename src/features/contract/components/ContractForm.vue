<template>
  <DetailLayout
      title="거래처 별 제품 계약 상세 정보 조회"
      description="거래처 별 제품 계약 상세 정보를 확인할 수 있습니다."
  >
    <template #basic>
      <!-- 거래처 정보 -->
      <div class="detail-section">
        <div class="section-label">거래처 정보</div>
          <div class="product-detail-grid">
            <div class="form-group">
              <label>거래처명</label>
              <input type="text" :value="contract.vendorName" readonly />
            </div>
            <div class="form-group">
              <label>거래처 유형</label>
              <input type="text" :value="contract.vendorStatus" readonly />
            </div>
            <div class="form-group">
              <label>사업자 등록번호</label>
              <input type="text" :value="contract.vendorTaxId" readonly />
            </div>
            <div class="form-group">
              <label>계약 상태</label>
              <input type="text" :value="contract.contractStatus" readonly class="modal-input" />
            </div>
          </div>
        </div>

      <!-- 제품 정보 -->
      <div class="detail-section">
        <div class="section-label">제품 정보</div>
        <div class="product-detail-grid">
          <div class="form-group">
            <label>제품명</label>
            <input type="text" :value="contract.productName" readonly />
          </div>
          <div class="form-group">
            <label>카테고리</label>
            <input type="text" :value="contract.categoryName" readonly />
          </div>
          <div class="form-group">
            <label>보관 상태</label>
            <input type="text" :value="contract.storeType" readonly />
          </div>
          <div class="form-group">
            <label>기본 단가</label>
            <input type="text" :value="formatPrice(contract.basePrice)" readonly />
          </div>
          <div class="form-group">
            <label>단위 수량</label>
            <input type="text" :value="formatNumber(contract.unitQuantity)" readonly />
          </div>
          <div class="form-group">
            <label>단위 규격</label>
            <input type="text" :value="contract.unitSpec" readonly />
          </div>
        </div>
      </div>
    </template>

    <template #detail>

      <div class="modal-actions">
        <!-- 만료 전: 수정/만료 버튼 -->
        <button
            v-if="!isEditing && contract.contractStatus !== 'EXPIRED'"
            class="save"
            @click="startEdit"
        >계약 수정</button>
        <button
            v-if="!isEditing && contract.contractStatus !== 'EXPIRED'"
            class="expire"
            @click="expireModalOpen = true"
        >계약 만료</button>
        <!-- 수정 중 && 만료 전: 저장/취소 -->
        <button
            v-if="isEditing && contract.contractStatus !== 'EXPIRED'"
            class="save"
            @click="saveEdit"
        >저장</button>
        <button
            v-if="isEditing && contract.contractStatus !== 'EXPIRED'"
            class="cancel"
            @click="cancelEdit"
        >취소</button>
        <!-- 만료 상태: 안내 메시지 -->
        <div
            v-if="contract.contractStatus === 'EXPIRED'"
            style="margin-left:auto; color:#e36c5d; font-weight:600;"
        >
          만료된 계약은 수정할 수 없습니다.
        </div>
      </div>

      <!-- 계약 정보 -->
      <div class="detail-section">
        <div class="section-label">계약 정보</div>
      <div class="product-detail-grid">
        <div class="form-group">
          <label>계약 단가</label>
          <input
              v-if="isEditing"
              v-model="edit.contractPrice"
              :readonly="!isEditing"
          />
          <input
              v-else
              :value="formatPrice(edit.contractPrice)"
              readonly
          />
        </div>
        <div class="form-group">
          <label>최소 발주 수량(MOQ)</label>
          <input :readonly="!isEditing" v-model="edit.minOrderQty" />
        </div>
        <div class="form-group">
          <label>납기일</label>
          <input
              v-if="isEditing"
              v-model="edit.leadTime"
              :readonly="!isEditing"
          />
          <input
              v-else
              :value="formatDay(edit.leadTime)"
              readonly
          />
        </div>
        <div class="form-group">
          <label>계약 시작일</label>
          <input :readonly="!isEditing" v-model="edit.contractStartDate" />
        </div>
        <div class="form-group">
          <label>계약 종료일</label>
          <input :readonly="!isEditing" v-model="edit.contractEndDate" />
        </div>
        <div class="form-group">
          <label>계약 상태</label>
          <input type="text" :value="edit.contractStatus" readonly />
        </div>
        <div class="form-group">
          <label>등록일시</label>
          <input type="text" :value="contract.createdAt" readonly />
        </div>
        <div class="form-group">
          <label>수정일시</label>
          <input type="text" :value="contract.modifiedAt" readonly />
        </div>
      </div>
      </div>
    </template>
  </DetailLayout>

  <ContractExpireConfirmModal
      v-if="expireModalOpen"
      :contract-id="contract.contractId"
      @close="expireModalOpen = false"
      @expired="handleExpireSuccess"
  />
  <ContractDoneModal
      v-if="doneModalOpen"
      :type="doneModalType"
      @close="doneModalOpen = false"
  />
  <ContractErrorModal
      v-if="ErrorOpen"
      :message="ErrorMsg"
      @close="ErrorOpen = false"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { updateContract } from '@/features/contract/api.js'
import DetailLayout from "@/components/layout/DetailLayout.vue";
import ContractErrorModal from "@/features/contract/components/ContractErrorModal.vue";
import ContractDoneModal from "@/features/contract/components/ContractDoneModal.vue";
import ContractExpireConfirmModal from "@/features/contract/components/ContractExpireConfirmModal.vue";

const props = defineProps({
  contract: { type: Object, required: true }
})

const emit = defineEmits(['refresh'])

const isEditing = ref(false)
const edit = ref({})

const doneModalOpen = ref(false)
const doneModalType = ref('edit')

const ErrorOpen = ref(false)
const ErrorMsg = ref('')

function showError(msg) {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

const expireModalOpen = ref(false)

function handleExpireSuccess() {

  doneModalType.value = 'expire'
  doneModalOpen.value = true;

  emit('refresh')
}

// contract → edit 복사
watch(
    () => props.contract,
    (val) => {
      edit.value = {
        contractPrice: val.contractPrice ?? "",
        minOrderQty: val.minOrderQty ?? "",
        leadTime: val.leadTime ?? "",
        contractStartDate: val.contractStartDate ?? "",
        contractEndDate: val.contractEndDate ?? "",
        contractStatus: val.contractStatus ?? "",
      }
    },
    { immediate: true }
)

// 편집 시작
function startEdit() {
  if (props.contract.contractStatus === 'EXPIRED') {
    showError('만료된 계약은 수정할 수 없습니다.')
    return
  }
  isEditing.value = true
}

// 저장
async function saveEdit() {
  if (props.contract.contractStatus === 'EXPIRED') {
    showError('만료된 계약은 수정할 수 없습니다.');
    isEditing.value = false;
    return;
  }
  try {

    await updateContract(props.contract.contractId, {
      contractPrice: edit.value.contractPrice,
      minOrderQty: edit.value.minOrderQty,
      leadTime: edit.value.leadTime,
      contractStartDate: edit.value.contractStartDate,
      contractEndDate: edit.value.contractEndDate,
      // contractStatus는 변경 X
    })

    doneModalType.value = 'edit'
    doneModalOpen.value = true

    isEditing.value = false
    emit('refresh')
  } catch (e) {
    showError( e.response?.data?.message || e.message)
  }
}

// 편집 취소
function cancelEdit() {
  isEditing.value = false
  // contract → edit 복구
  edit.value = {
    contractPrice: props.contract.contractPrice ?? "",
    minOrderQty: props.contract.minOrderQty ?? "",
    leadTime: props.contract.leadTime ?? "",
    contractStartDate: props.contract.contractStartDate ?? "",
    contractEndDate: props.contract.contractEndDate ?? "",
    contractStatus: props.contract.contractStatus ?? "",
  }
}

function formatNumber(val) {
  if (val == null || val === "" || isNaN(val)) return "-"
  return Number(val).toLocaleString()
}

function formatPrice(val) {
  if (val == null || val === "" || isNaN(val)) return "-";
  return Number(val).toLocaleString() + "원";
}
function formatDay(val) {
  if (val == null || val === "" || isNaN(val)) return "-";
  return val + "일";
}
</script>

<style scoped>
.product-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px #e7e9f0;
  padding: 36px 28px 24px 28px;
  margin-bottom: 32px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.form-group label {
  font-weight: 700;
  color: #26272b;
  font-size: 1.08rem;
}
.form-group input {
  background: #f7faff;
  border: 1.2px solid #e4e7ee;
  border-radius: 7px;
  font-size: 1.01rem;
  font-weight: 500;
  padding: 8px 10px;
  outline: none;
  margin-bottom: 0;
  color: #26272b;
}
.form-group input[readonly] {
  background: #f3f5f9;
  color: #232a34;
}

.detail-section {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 10px 0 #e7e9f0;
  padding: 28px 24px 16px 24px;
  margin-bottom: 28px;
}
.section-label {
  font-size: 1.08rem;
  font-weight: 700;
  background: #c2c7ce;
  color: #fff;
  padding: 0.6rem 1.2rem 0.55rem 1.2rem;
  border-radius: 8px 8px 0 0;
  margin-bottom: 1.2rem;
  letter-spacing: -0.01em;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.modal-actions .save {
  background: #3bb2e7;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.05rem;
  font-weight: 700;
  min-width: 76px;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.14s;
}
.modal-actions .save:hover {
  background: #249fd4;
}

.modal-actions .cancel {
  background: #eceff2;
  color: #242b33;
  border: none;
  border-radius: 7px;
  font-size: 1.05rem;
  font-weight: 600;
  min-width: 76px;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.14s;
}
.modal-actions .cancel:hover {
  background: #d7dade;
}

.modal-actions .expire {
  background: #e36c5d;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.05rem;
  font-weight: 600;
  min-width: 76px;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.14s;
}
.modal-actions .expire:hover {
  background: #c24632;
}

@media (max-width: 900px) {
  .product-detail-grid { grid-template-columns: 1fr 1fr; padding: 18px 8px;}
}
@media (max-width: 600px) {
  .product-detail-grid { grid-template-columns: 1fr; gap: 16px;}
}
</style>
