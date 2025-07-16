<template>
  <DetailLayout
      title="거래처 상세 정보 조회"
      description="거래처 상세 정보를 확인할 수 있습니다."
  >
    <template #actions>
      <template v-if="!isEditing">
        <StatusButton type="primary" @click="startEdit">수정</StatusButton>
      </template>
      <template v-else>
        <StatusButton type="primary" @click="handleSave">저장</StatusButton>
        <StatusButton type="default" @click="cancelEdit">취소</StatusButton>
      </template>
    </template>

    <template #basic>
      <!-- 거래처 유형 / 상태 -->
      <div class="section-title">거래처 유형 / 거래 상태</div>
      <div class="info-grid">
        <div>
          <label>거래처 유형</label>
          <select v-model="form.vendorType" :disabled="!isEditing" class="input">
            <option value="SUPPLIER">공급업체</option>
            <option value="TRUST_CONTRACTOR">위탁업체</option>
            <option value="LOGISTICS">물류</option>
            <option value="AGENCY">대행업체</option>
          </select>
        </div>
        <div>
          <label>거래 상태</label>
          <select v-model="form.vendorStatus" :disabled="!isEditing" class="input">
            <option value="IN_PROGRESS">계약 진행 중</option>
            <option value="TERMINATED">계약 만료</option>
          </select>
        </div>
      </div>

      <!-- 거래처 담당자 -->
      <div class="section-title">거래처 담당자</div>
      <div class="contact-row">
        <div>
          <label>성명</label>
          <div class="readonly-field">{{ form.vendorManagerName || '-' }}</div>
        </div>
        <div>
          <label>거래처 담당자 연락처</label>
          <div class="readonly-field">{{ formatPhone(form.phoneNumber) || '000-0000-0000' }}</div>
        </div>
      </div>

      <!-- 거래처 정보 -->
      <div class="section-title">거래처 정보</div>

      <!-- 1행: 거래처명 | 사업자 등록 번호 | 계약서 첨부 -->
      <div class="info-grid">
        <div>
          <label>거래처명</label>
          <div v-if="!isEditing" class="readonly-field">{{ form.vendorName }}</div>
          <input v-else v-model="form.vendorName" class="input" />
        </div>
        <div>
          <label>사업자 등록 번호</label>
          <div v-if="!isEditing" class="readonly-field">{{ form.vendorTaxId || 'XXXXXXXXX' }}</div>
          <input v-else v-model="form.vendorTaxId" class="input" maxlength="10" />
        </div>
        <div class="col-span-2">
          <label>계약서 첨부</label>
          <div
              v-if="!isEditing"
              class="readonly-field file-readonly clickable"
              @click="downloadAgreement"
          >
            <span v-if="form.agreementOriginalFileName">🧾 {{ form.agreementOriginalFileName }}</span>
            <span v-else style="color: #999;">첨부된 파일이 없습니다.</span>
          </div>

          <div v-else class="file-edit-wrap-horizontal">
            <!-- 파일 선택 버튼 -->
            <label class="upload-label" for="agreement-upload">🧾 계약서 파일 선택</label>
            <input
                id="agreement-upload"
                type="file"
                ref="agreementInputRef"
                @change="onAgreementFileChange"
                class="upload-input-hidden"
            />

            <!-- 선택된 파일 정보 -->
            <div
                class="file-preview-inline"
                v-if="agreementFileName || form.agreementOriginalFileName"
            >
              <span>🧾 {{ agreementFileName || form.agreementOriginalFileName }}</span>
              <span v-if="agreementFileSize" class="file-size">({{ agreementFileSize }})</span>
              <button class="remove-btn" @click="removeAgreementFile"></button>
            </div>
          </div>

        </div>
      </div>

      <!-- 2행: 계약 시작일 | 계약 종료일 | 주소 -->
      <div class="info-grid">
        <div>
          <label>계약 시작일</label>
          <div v-if="!isEditing" class="readonly-field">{{ formatDate(form.vendorStartDate) || 'yyyy.mm.dd' }}</div>
          <FilterDate v-else v-model="form.vendorStartDate" placeholder="계약 시작일 선택" />
        </div>
        <div>
          <label>계약 종료일</label>
          <div v-if="!isEditing" class="readonly-field">{{ formatDate(form.vendorEndDate) || 'yyyy.mm.dd' }}</div>
          <FilterDate v-else v-model="form.vendorEndDate" placeholder="계약 종료일 선택" />
        </div>
        <div class="col-span-2">
          <label>주소</label>
          <div v-if="!isEditing" class="readonly-field">
            {{ form.vendorAddress?.zipcode || '' }}
            <span style="margin-left: 2em;">
              {{ form.vendorAddress?.addressRoad || '' }}
              <template v-if="form.vendorAddress?.addressDetail">
                , {{ form.vendorAddress.addressDetail }}
              </template>
            </span>
          </div>
          <div v-else class="address-edit-wrap">
            <div style="display:flex; gap:8px;">
              <input v-model="form.vendorAddress.zipcode" class="input" placeholder="우편번호" style="flex:1;" />
              <input v-model="form.vendorAddress.addressRoad" class="input" placeholder="도로명 주소" style="flex:3;" />
            </div>
            <input v-model="form.vendorAddress.addressDetail" class="input" placeholder="상세 주소" style="margin-top: 6px;" />
          </div>
        </div>
      </div>

      <!-- 3행: 생성일시 | 수정일시 -->
      <div class="info-grid">
        <div>
          <label>생성 일시</label>
          <div class="readonly-field">
            {{ formatDateTime(form.createdAt) || '-' }}
          </div>
        </div>
        <div>
          <label>수정 일시</label>
          <div class="readonly-field">
            {{ formatDateTime(form.modifiedAt) || '-' }}
          </div>
        </div>
      </div>
    </template>
  </DetailLayout>

  <!-- 등록/수정 완료 모달 -->
  <VendorDoneModal
      v-if="doneModal.show"
      :type="doneModal.type"
      @close="doneModal.show = false"
  />

  <!-- 에러 모달 -->
  <div>
    <VendorErrorModal
        v-if="ErrorOpen"
        :message="ErrorMsg"
        @close="ErrorOpen = false"
    />
  </div>

  <!-- 삭제 확인 모달 -->
  <VendorDeleteConfirmModal
      v-if="deleteTarget"
      :target-id="deleteTarget.id"
      @close="deleteTarget = null"
      @deleted="router.push('/vendor/list')"
  />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import { fetchVendorById, updateVendor, fetchVendorAgreementDownloadUrl } from '@/features/vendor/api.js'
import VendorDeleteConfirmModal from "@/features/vendor/components/VendorDeleteConfirmModal.vue";
import VendorErrorModal from "@/features/vendor/components/VendorErrorModal.vue";
import VendorDoneModal from "@/features/vendor/components/VendorDoneModal.vue";
import FilterDate from "@/components/common/filters/FilterDate.vue";

const isEditing = ref(false)
const vendor = ref({})
const form = reactive({
  vendorType: '',
  vendorStatus: '',
  vendorManagerName: '',
  phoneNumber: '',
  vendorName: '',
  franchiseContact: '',
  vendorTaxId: '',
  agreementOriginalFileName: '',
  vendorAddress: { zipcode: '', addressRoad: '', addressDetail: '' },
  vendorStartDate: '',
  vendorEndDate: '',
  createdAt: '',
  modifiedAt: '',
  vendorId: null,
})

const ErrorOpen = ref(false)
const ErrorMsg = ref('')

const deleteTarget = ref(null)
const openDeleteModal = () => {
  deleteTarget.value = { id: vendor.value.vendorId };
};

function showError(msg) {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

// 등록/수정 완료 모달 상태
const doneModal = ref({
  show: false,
  type: 'edit',    //  'register' | 'edit' | 'delete'
})

const agreementFile = ref(null)
const agreementFileName = ref('')
const agreementFileSize = ref('')

function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else if (size >= 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  }
  return size + ' B'
}

function copyVendorToForm(v) {
  Object.assign(form, JSON.parse(JSON.stringify(v)))

  form.franchiseContact = v.franchiseContact || ''
  form.vendorAddress = {
    zipcode: v.vendorAddress?.zipcode || '',
    addressRoad: v.vendorAddress?.addressRoad || '',
    addressDetail: v.vendorAddress?.addressDetail || ''
  }
  console.log('[form.agreementOriginalFileName]', form.agreementOriginalFileName)
}

function formatPhone(phone) {
  if (!phone) return '-'
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.length === 11)
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  if (digits.length === 10)
    return digits.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  return '-'
}
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
}
function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
}

async function downloadAgreement() {
  if (!form.agreementOriginalFileName) return

  try {
    const res = await fetchVendorAgreementDownloadUrl(form.vendorId)
    const presignedUrl = res.data.data.presignedUrl

    console.log('[downloadAgreement] presignedUrl:', presignedUrl)

    const a = document.createElement('a')
    a.href = presignedUrl
    a.setAttribute('download', form.agreementOriginalFileName)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (e) {
    console.error(e)
    showError('계약서 다운로드에 실패했습니다.')
  }
}

const agreementFileDeleted = ref(false);

const removeAgreementFile = () => {
  agreementFile.value = null;
  agreementFileName.value = '';
  agreementFileSize.value = '';
  form.agreementOriginalFileName = '';
  agreementFileDeleted.value = true;
};

function startEdit() {
  isEditing.value = true
  copyVendorToForm(vendor.value)

  // 💡 주소 값이 없을 경우 빈 문자열로 기본값 세팅
  form.vendorAddress.zipcode ??= ''
  form.vendorAddress.addressRoad ??= ''
  form.vendorAddress.addressDetail ??= ''

  agreementFile.value = null
  agreementFileName.value = ''

  agreementFileSize.value = vendor.value.agreementFileSize
      ? formatFileSize(vendor.value.agreementFileSize)
      : ''
}

function cancelEdit() {
  isEditing.value = false
  copyVendorToForm(vendor.value)
  agreementFile.value = null
  agreementFileName.value = ''
}

function onAgreementFileChange(e) {
  agreementFile.value = e.target.files[0]
  agreementFileName.value = agreementFile.value ? agreementFile.value.name : ''
  agreementFileSize.value = agreementFile.value ? formatFileSize(agreementFile.value.size) : ''
}

async function handleSave() {
  try {

    form.vendorAddress.zipcode = form.vendorAddress.zipcode || ''
    form.vendorAddress.addressRoad = form.vendorAddress.addressRoad || ''
    form.vendorAddress.addressDetail = form.vendorAddress.addressDetail || ''

    const requestPayload = {
      vendorName: form.vendorName,
      vendorType: form.vendorType,
      vendorTaxId: form.vendorTaxId,
      vendorMemo: form.vendorMemo,
      vendorStatus: form.vendorStatus,
      vendorStartDate: form.vendorStartDate,
      vendorEndDate: form.vendorEndDate,
      addressRequest: {
        zipcode: form.vendorAddress.zipcode || '',
        addressRoad: form.vendorAddress.addressRoad || '',
        addressDetail: form.vendorAddress.addressDetail || ''
      },
      agreementFileDeleted: agreementFileDeleted.value
    }

    await updateVendor(form.vendorId, requestPayload, agreementFile.value)

    isEditing.value = false
    agreementFile.value = null
    agreementFileName.value = ''
    const res = await fetchVendorById(form.vendorId)
    vendor.value = res.data.data
    copyVendorToForm(vendor.value)
    doneModal.value = { show: true, type: 'edit' }
  } catch (e) {
    showError('수정에 실패했습니다. 다시 시도해 주세요.')
  }
}

onMounted(async () => {
  const vendorId = useRoute().params.vendorId
  if (!vendorId) {
    showError('잘못된 접근입니다.')
    return
  }
  const res = await fetchVendorById(vendorId)
  console.log('[fetchVendorById] 응답:', res.data.data)
  vendor.value = res.data.data
  copyVendorToForm(vendor.value)
})
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 1rem;
  margin-bottom: 4px;
  background: #fff;
}
.input {
  width: 100%;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 1rem;
  margin-bottom: 4px;
  background: #fff;
}
.readonly-field {
  background: #dbdbdb;
  color: #1c1c1c;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 1rem;
}
.row-btn-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 20px;
  margin-bottom: 22px;
  align-items: center;
}
.info-grid {
  display: grid;
  grid-template-columns:  1fr 1fr 2fr 1fr;
  gap: 12px 20px;
  margin-bottom: 22px;
}
.col-span-2 { grid-column: span 2; }
.section-title {
  font-weight: bold;
  margin: 18px 0 10px 0;
  font-size: 1.15rem;
}
.contact-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}
.contact-row > div { flex: 1 }
label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

.file-readonly.clickable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.file-readonly.clickable:hover {
  background-color: #d2e3ff;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 1rem;
  margin-left: auto;
}

.file-edit-wrap-horizontal {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.upload-label {
  display: inline-block;
  background-color: #2c7be5;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.upload-label:hover {
  background-color: #1b5dc9;
}

.upload-input-hidden {
  display: none;
}

.file-preview-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f7f9fc;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dde3eb;
  font-size: 0.95rem;
}

.file-size {
  font-size: 0.85rem;
  color: #666;
}

</style>
