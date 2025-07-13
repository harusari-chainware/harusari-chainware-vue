<template>
  <DetailLayout
      title="거래처 기본 정보 조회"
      description="거래처 상세 정보를 확인할 수 있습니다."
  >
    <template #actions>
      <template v-if="!isEditing">
        <StatusButton type="primary" @click="startEdit">수정</StatusButton>
        <StatusButton type="danger" @click="openDeleteModal">삭제</StatusButton>
      </template>
      <template v-else>
        <StatusButton type="primary" @click="handleSave">저장</StatusButton>
        <StatusButton type="default" @click="cancelEdit">취소</StatusButton>
      </template>
    </template>

    <template #basic>
      <div class="section-title">거래처 유형 / 거래 상태</div>
      <div class="contact-row">
          <label>거래처 유형</label>
          <select v-model="form.vendorType" :disabled="!isEditing">
            <option value="SUPPLIER">공급업체</option>
            <option value="TRUST_CONTRACTOR">위탁업체</option>
            <option value="LOGISTICS">물류</option>
            <option value="AGENCY">대행업체</option>
          </select>
        <label>거래 상태</label>
        <select v-model="form.vendorStatus" :disabled="!isEditing">
          <option value="IN_PROGRESS">계약 진행 중</option>
          <option value="TERMINATED">계약 만료</option>
        </select>
      </div>

      <!-- 담당자 정보 -->
      <div class="section-title">거래처 담당자</div>
      <div class="contact-row">
        <div>
          <label>성명</label>
          <div v-if="!isEditing" class="readonly-field">{{ form.vendorManagerName || '-' }}</div>
          <input v-else v-model="form.vendorManagerName" class="input" />
        </div>
        <div>
          <label>거래처 담당자 연락처</label>
          <div v-if="!isEditing" class="readonly-field">{{ formatPhone(form.phoneNumber) || '000-0000-0000' }}</div>
          <input v-else v-model="form.phoneNumber" class="input" maxlength="13" />
        </div>
      </div>

      <!-- 거래처 정보 -->
      <div class="section-title">거래처 정보</div>
      <div class="info-grid">
        <div>
          <label>거래처명</label>
          <div v-if="!isEditing" class="readonly-field">{{ form.vendorName }}</div>
          <input v-else v-model="form.vendorName" class="input" />
        </div>
        <div>
          <label>거래처 전화번호</label>
          <div v-if="!isEditing" class="readonly-field">{{ formatPhone(form.phoneNumber) }}</div>
          <input v-else v-model="form.phoneNumber" class="input" maxlength="13" />
        </div>
        <div>
          <label>사업자 등록 번호</label>
          <div v-if="!isEditing" class="readonly-field">{{ form.vendorTaxId || 'XXXXXXXXX' }}</div>
          <input v-else v-model="form.vendorTaxId" class="input" maxlength="10" />
        </div>
        <div>
          <label>계약서 첨부</label>
          <div v-if="!isEditing" class="readonly-field">
            <a v-if="form.agreementOriginalFileName" href="#" @click.prevent="downloadAgreement">
              {{ form.agreementOriginalFileName }}
            </a>
            <span v-else>file</span>
          </div>
          <div v-else>
            <input type="file" @change="onAgreementFileChange" />
            <div v-if="agreementFileName" style="font-size: 0.92em;">선택된 파일: {{ agreementFileName }}</div>
            <div v-else-if="form.agreementOriginalFileName" style="font-size: 0.92em;">
              기존: {{ form.agreementOriginalFileName }}
            </div>
          </div>
        </div>
        <div class="col-span-2">
          <label>주소</label>
          <div v-if="!isEditing" class="readonly-field">
            {{ form.vendorAddress?.zipcode || '' }} {{ form.vendorAddress?.addressRoad || '' }} {{ form.vendorAddress?.addressDetail || '' }}
          </div>
          <div v-else style="display:flex; gap:6px;">
            <input v-model="form.vendorAddress.zipcode" class="input" placeholder="도로명주소" style="flex:2;" />
            <input v-model="form.vendorAddress.addressRoad" class="input" placeholder="도로명주소" style="flex:2;" />
            <input v-model="form.vendorAddress.addressDetail" class="input" placeholder="상세주소" style="flex:1;" />
          </div>
        </div>
        <div>
          <label>계약 종료일</label>
          <div v-if="!isEditing" class="readonly-field">{{ formatDate(form.vendorEndDate) || 'yyyy.mm.dd' }}</div>
          <FilterDate
              v-else
              v-model="form.vendorEndDate"
              placeholder="계약 종료일 선택"
          />
        </div>
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
      @deleted="router.push('/Vendor/list')"
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
  vendorTaxId: '',
  agreementOriginalFileName: '',
  vendorAddress: { zipcode: '', addressRoad: '', addressDetail: '' },
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

function copyVendorToForm(v) {
  Object.assign(form, JSON.parse(JSON.stringify(v)))
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
  const url = await fetchVendorAgreementDownloadUrl(form.vendorId)
  window.open(url, '_blank')
}

function startEdit() {
  isEditing.value = true
  copyVendorToForm(vendor.value)
  agreementFile.value = null
  agreementFileName.value = ''
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
}

async function handleSave() {
  try {
    await updateVendor(form.vendorId, { ...form }, agreementFile.value)
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
  grid-template-columns: repeat(4, 1fr);
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

</style>
