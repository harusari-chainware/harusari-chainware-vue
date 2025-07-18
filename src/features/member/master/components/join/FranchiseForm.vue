<template>
    <div class="franchise-box">
        <h2>가맹점 정보</h2>
        <div class="form-group">
            <label for="franchiseName">가맹점 이름</label>
            <input type="text" id="franchiseName" v-model="form.franchiseName" placeholder="가맹점 이름 입력" />
        </div>
        <div class="form-group">
            <label for="franchiseContact">가맹점 연락처</label>
            <input type="text" id="franchiseContact" v-model="form.franchiseContact" placeholder="OO-OOO-OOOO" />
        </div>
        <div class="form-group">
            <label for="franchiseTaxId">사업자 번호</label>
            <input type="text" id="franchiseTaxId" v-model="form.franchiseTaxId" placeholder="OOO-OO-OOOO" />
        </div>
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
        <div class="form-group">
            <label for="contractStartDate">계약 시작일</label>
            <input type="date" id="contractStartDate" v-model="form.contractStartDate" />
        </div>
        <div class="form-group">
            <label for="contractEndDate">계약 종료일</label>
            <input type="date" id="contractEndDate" v-model="form.contractEndDate" />
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
    <ConfirmModal ref="alertModal" />
</template>

<script setup>
import {ref, defineProps, defineEmits, nextTick, watch} from 'vue';
import ConfirmModal from "@/features/member/mypage/components/ConfirmModal.vue";

const props = defineProps({ form: Object });
const emits = defineEmits(['update:agreementFile']);
const alertModal = ref(null);

const agreementFileName = ref('');

function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        alertModal.value.open('PDF 파일만 업로드 가능합니다.');
        event.target.value = '';
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        alertModal.value.open('10MB 이하의 파일만 업로드 가능합니다.');
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
        alertModal.value.open('주소 검색 서비스를 불러오지 못했습니다.\n네트워크 상태를 확인하거나 새로고침해 주세요.');
        return;
    }

    new window.daum.Postcode({
        oncomplete: function (data) {
            props.form.zipcode = data.zonecode;
            props.form.addressRoad = data.roadAddress || data.jibunAddress;
            nextTick(() => document.getElementById('addressDetail')?.focus());
        }
    }).open();
}

function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.startsWith('02')) {
        if (cleaned.length <= 2) return cleaned;
        else if (cleaned.length <= 5) return cleaned.slice(0, 2) + '-' + cleaned.slice(2);
        else if (cleaned.length <= 9) return cleaned.slice(0, 2) + '-' + cleaned.slice(2, 5) + '-' + cleaned.slice(5);
        else return cleaned.slice(0, 2) + '-' + cleaned.slice(2, 6) + '-' + cleaned.slice(6, 10);
    } else {
        if (cleaned.length <= 3) return cleaned;
        else if (cleaned.length <= 6) return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
        else if (cleaned.length <= 10) return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
        else return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7, 11);
    }
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
        () => props.form.franchiseContact,
        (newValue) => {
            if (!newValue) return;
            const formatted = formatPhoneNumber(newValue);
            if (formatted !== newValue) {
                props.form.franchiseContact = formatted;
            }
        }
);

watch(
        () => props.form.franchiseTaxId,
        (newValue) => {
            if (!newValue) return;
            const formatted = formatBusinessNumber(newValue);
            if (formatted !== newValue) {
                props.form.franchiseTaxId = formatted;
            }
        }
);
</script>

<style scoped>
.franchise-box {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 100%;
    max-width: 530px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.form-group {
    margin-bottom: 10px;
}

h2 {
    text-align: center;
    margin-bottom: 10px;
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

input {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.9rem;
    border: 1px solid #ccd1d7;
    border-radius: 6px;
}

input:focus {
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