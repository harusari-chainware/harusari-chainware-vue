<template>
    <div class="vendor-box">
        <h2>거래처 정보</h2>

        <!-- 거래처 이름 -->
        <div class="form-group">
            <label for="vendorName">거래처 이름</label>
            <input type="text" id="vendorName" v-model="form.vendorName" placeholder="거래처 이름 입력" />
        </div>

        <!-- 거래처 유형 -->
        <div class="form-group">
            <label for="vendorType">거래처 유형</label>
            <select v-model="form.vendorType" id="vendorType">
                <option value="">거래처 유형 선택</option>
                <option value="SUPPLIER">공급업체</option>
                <option value="TRUST_CONTRACTOR">위탁업체</option>
                <option value="LOGISTICS">물류</option>
                <option value="AGENCY">대행업체</option>
            </select>
        </div>

        <!-- 사업자 번호 -->
        <div class="form-group">
            <label for="vendorTaxId">사업자 번호</label>
            <input type="text" id="vendorTaxId" v-model="form.vendorTaxId" placeholder="OOO-OO-OOOO" />
        </div>

        <!-- 거래처 메모 -->
        <div class="form-group">
            <label for="vendorMemo">거래처 메모</label>
            <input type="text" id="vendorMemo" v-model="form.vendorMemo" placeholder="메모 입력" />
        </div>

        <!-- 거래처 상태 (항상 '활성' 상태로 설정) -->
        <input type="hidden" v-model="form.vendorStatus" value="ACTIVE" />

        <!-- 주소 -->
        <div class="form-group">
            <label for="zipcode">우편번호</label>
            <div class="zipcode-group">
                <input type="text" id="zipcode" v-model="form.zipcode" placeholder="우편번호" readonly />
                <button type="button" class="address-button" @click="execDaumPostcode">주소 검색</button>
            </div>
        </div>

        <div class="form-group">
            <label for="addressRoad">도로명 주소</label>
            <input type="text" id="addressRoad" v-model="form.addressRoad" placeholder="도로명 주소 입력" readonly />
        </div>

        <div class="form-group">
            <label for="addressDetail">상세 주소</label>
            <input type="text" id="addressDetail" v-model="form.addressDetail" placeholder="상세 주소 입력" />
        </div>

        <!-- 거래 시작일 -->
        <div class="form-group">
            <label for="vendorStartDate">계약 시작일</label>
            <input type="date" id="vendorStartDate" v-model="form.vendorStartDate" />
        </div>

        <!-- 거래 종료일 -->
        <div class="form-group">
            <label for="vendorEndDate">계약 종료일</label>
            <input type="date" id="vendorEndDate" v-model="form.vendorEndDate" />
        </div>

        <div class="form-group">
            <label>계약서 업로드 (PDF)</label>
            <div class="file-upload-wrapper">
                <label class="file-upload-label" for="agreementFile">
                    {{ agreementFileName || '파일 선택 (PDF)' }}
                </label>
                <input
                        type="file"
                        id="agreementFile"
                        accept="application/pdf"
                        @change="handleFileChange"
                        class="file-upload-input"
                />
                <button
                        v-if="agreementFileName"
                        type="button"
                        class="remove-file-button"
                        @click="removeFile"
                >✕</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick, watch } from 'vue';

const props = defineProps({ form: Object });
const emits = defineEmits(['update:agreementFile']);

const agreementFileName = ref('');

const form = ref({
    vendorName: '',
    vendorType: '',
    vendorTaxId: '',
    vendorMemo: '',
    vendorStatus: 'ACTIVE',
    vendorStartDate: '',
    vendorEndDate: '',
    zipcode: '',
    addressRoad: '',
    addressDetail: ''
});

function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        event.target.value = '';
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        alert('10MB 이하의 파일만 업로드 가능합니다.');
        event.target.value = '';
        return;
    }
    agreementFileName.value = file.name;
    emits('update:agreementFile', file);
}

function removeFile() {
    agreementFileName.value = '';
    emits('update:agreementFile', null);
    document.getElementById('agreementFile').value = '';
}

function execDaumPostcode() {
    if (!window.daum || !window.daum.Postcode) {
        alert('주소 검색 서비스를 불러오지 못했습니다. 네트워크 상태를 확인하거나 새로고침해 주세요.');
        return;
    }

    new window.daum.Postcode({
        oncomplete: function (data) {
            form.value.zipcode = data.zonecode;
            form.value.addressRoad = data.roadAddress || data.jibunAddress;
            nextTick(() => document.getElementById('addressDetail')?.focus());
        }
    }).open();
}

function formatBusinessNumber(value) {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    const length = cleaned.length;
    if (length <= 3) {
        return cleaned;
    } else if (length <= 5) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
    }
}

// Watch를 이용해 실시간 포맷 적용
watch(
        () => form.value.vendorTaxId,
        (newValue) => {
            if (!newValue) return;
            const formatted = formatBusinessNumber(newValue);
            if (formatted !== newValue) {
                form.value.vendorTaxId = formatted;
            }
        }
);
</script>

<style scoped>
.vendor-box {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 100%;
    max-width: 530px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.form-group {
    margin-bottom: 8px;
}

h2 {
    text-align: center;
    margin-bottom: 16px;
    font-weight: 700;
    color: #2e384d;
}

label {
    font-size: 0.9rem;
    margin-bottom: 4px;
    display: block;
    font-weight: 600;
    color: #333;
}

input, select {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.9rem;
    border: 1px solid #ccd1d7;
    border-radius: 6px;
}

select {
    appearance: none;
    background: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat;
    background-position: right 12px center;
    background-size: 16px 16px;
    padding-right: 40px;
}

input:focus, select:focus {
    border-color: #3aaed8;
    outline: none;
}

.zipcode-group {
    display: flex;
    gap: 6px;
}

.zipcode-group input {
    flex: 1;
}

.address-button {
    padding: 0 10px;
    background: #3aaed8;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
}

.file-upload-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-upload-label {
    flex: 1;
    background-color: #f5f7fa;
    padding: 10px 12px;
    border: 1px solid #ccd1d7;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background 0.2s, border-color 0.2s;
}

.file-upload-label:hover {
    background-color: #eaf3fa;
    border-color: #3aaed8;
}

.file-upload-input {
    display: none;
}

.remove-file-button {
    background: #fe6d73;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0 10px;
    cursor: pointer;
    font-size: 0.9rem;
    height: 36px;
}

.remove-file-button:hover {
    background: #f44336;
}
</style>