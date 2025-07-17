<template>
    <div class="register-member">
        <div class="signup-box">
            <h2>회원 정보</h2>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="email">이메일</label>
                    <div class="email-check-group">
                        <input type="email" id="email" v-model="form.email" placeholder="example@chainware.site"/>
                        <button type="button" class="check-btn" @click="checkEmailDuplicate">중복확인</button>
                    </div>
                    <p v-if="formErrors.first === 'email'" class="error-message">{{ formErrors.message }}</p>
                    <p v-if="formErrors.first === 'emailCheck'" class="error-message">{{ formErrors.message }}</p>
                    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                </div>

                <!-- 나머지 입력 필드들 -->
                <div class="form-group" v-for="field in fields" :key="field.id">
                    <label :for="field.id">{{ field.label }}</label>
                    <input v-if="field.type !== 'select'" :type="field.type" :id="field.id" v-model="form[field.model]"
                           :placeholder="field.placeholder"/>
                    <select v-else :id="field.id" v-model="form.authority">
                        <option value="">권한 선택</option>
                        <option value="master">마스터</option>
                        <option value="general-manager">일반 관리자</option>
                        <option value="senior-manager">책임 관리자</option>
                        <option value="warehouse-manager">창고 관리자</option>
                        <option value="franchise-manager">가맹점 담당자</option>
                        <option value="vendor-manager">거래처 담당자</option>
                    </select>
                    <p v-if="formErrors.first === field.model" class="error-message">{{ formErrors.message }}</p>
                </div>

                <button type="submit" class="submit-btn">회원 등록</button>
            </form>
        </div>

        <!-- 창고 관리자 선택 시 창고 관련 입력 폼 표시 -->
        <WarehouseForm v-if="form.authority === 'warehouse-manager'" :form="form"/>

        <!-- 가맹점 담당자 선택 시 가맹점 관련 입력 폼 표시 -->
        <FranchiseForm v-if="form.authority === 'franchise-manager'" :form="form" @update:agreementFile="handleFileChange"/>

        <!-- 거래처 담당자 선택 시 거래처 관련 입력 폼 표시 -->
        <VendorForm v-if="form.authority === 'vendor-manager'" :form="form" @update:agreementFile="handleFileChange"/>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import FranchiseForm from '@/features/member/master/components/join/FranchiseForm.vue';
import VendorForm from "@/features/member/master/components/join/VendorForm.vue";
import WarehouseForm from "@/features/member/master/components/join/WarehouseForm.vue";
import {
    checkEmailDuplicateApi,
    franchiseMemberRegister,
    vendorMemberRegister,
    headquartersMemberRegister,
    warehouseMemberRegister
} from '@/features/member/api.js';

const router = useRouter();

const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthDate: '',
    position: '',
    authority: '',
    validationToken: null,
    warehouseName: '', // 창고용
    zipcode: '',
    addressRoad: '',
    addressDetail: '',
    agreementFile: null, // 가맹점/거래처용
    vendorName: '',
    vendorType: '',
    vendorTaxId: '',
    vendorMemo: '',
    vendorStartDate: '',
    vendorEndDate: ''
});

const fields = [
    {id: 'password', label: '비밀번호', model: 'password', placeholder: '비밀번호 8자리 이상 입력', type: 'password'},
    {id: 'confirmPassword', label: '비밀번호 확인', model: 'confirmPassword', placeholder: '비밀번호 재입력', type: 'password'},
    {id: 'name', label: '이름', model: 'name', placeholder: '이름 입력', type: 'text'},
    {id: 'phone', label: '전화번호', model: 'phone', placeholder: 'OOO-OOOO-OOOO', type: 'text'},
    {id: 'birthDate', label: '생년월일', model: 'birthDate', placeholder: '', type: 'date'},
    {id: 'position', label: '직책', model: 'position', placeholder: '직책 입력', type: 'text'},
    {id: 'authority', label: '권한', model: 'authority', type: 'select'}
];

const formErrors = ref({
    first: '',
    message: ''
});

const successMessage = ref('');

async function checkEmailDuplicate() {
    if (!form.value.email) {
        formErrors.value = {first: 'email', message: '이메일을 입력해주세요.'};
        return;
    }
    try {
        const res = await checkEmailDuplicateApi(form.value.email);
        if (res.data.data.exists) {
            formErrors.value = {first: 'emailCheck', message: '이미 사용 중인 이메일입니다.'};
            form.value.validationToken = null;
            successMessage.value = '';
        } else {
            formErrors.value = {first: '', message: ''};
            form.value.validationToken = res.data.data.validationToken;
            successMessage.value = '사용 가능한 이메일입니다.';
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    } catch (error) {
        formErrors.value = {first: 'emailCheck', message: '이메일 중복 확인 중 오류가 발생했습니다.'};
        successMessage.value = '';
        console.error(error);
    }
}

function handleFileChange(file) {
    form.value.agreementFile = file;
}

function validateForm() {
    let isValid = true;
    formErrors.value = {first: '', message: ''};

    if (!form.value.validationToken) {
        formErrors.value = {first: 'emailCheck', message: '이메일 중복 확인을 먼저 진행해주세요.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.email) {
        formErrors.value = {first: 'email', message: '이메일을 입력해주세요.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.password || form.value.password.length < 8) {
        formErrors.value = {first: 'password', message: '비밀번호는 8자리 이상이어야 합니다.'};
        isValid = false;
        return isValid;
    }
    if (form.value.password !== form.value.confirmPassword) {
        formErrors.value = {first: 'confirmPassword', message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.name) {
        formErrors.value = {first: 'name', message: '이름을 입력해주세요.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.phone || form.value.phone.replace(/\D/g, '').length < 10) {
        formErrors.value = {first: 'phone', message: '유효한 전화번호를 입력해주세요.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.birthDate) {
        formErrors.value = {first: 'birthDate', message: '생년월일을 입력해주세요.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.position) {
        formErrors.value = {first: 'position', message: '직책을 입력해주세요.'};
        isValid = false;
        return isValid;
    }
    if (!form.value.authority) {
        formErrors.value = {first: 'authority', message: '권한을 선택해주세요.'};
        isValid = false;
        return isValid;
    }

    return isValid;
}

async function submitForm() {
    if (!validateForm()) return;

    const phoneWithoutHyphen = (form.value.phone || '').replace(/\D/g, '');
    const formattedAuthority = (form.value.authority || '').replace('-', '_').toUpperCase();

    const memberCreateRequest = {
        email: form.value.email,
        password: form.value.password,
        name: form.value.name,
        phoneNumber: phoneWithoutHyphen,
        birthDate: form.value.birthDate,
        position: form.value.position,
        authorityName: formattedAuthority,
        validationToken: form.value.validationToken
    };

    try {
        let response;

        if (['master', 'general-manager', 'senior-manager'].includes(form.value.authority)) {
            response = await headquartersMemberRegister(memberCreateRequest);
        }
        else if (form.value.authority === 'franchise-manager') {
            const memberWithFranchiseRequest = {
                memberCreateRequest,
                franchiseCreateRequest: {
                    franchiseName: form.value.franchiseName,
                    franchiseContact: form.value.franchiseContact.replace(/\D/g, ''),
                    franchiseTaxId: form.value.franchiseTaxId.replace(/\D/g, ''),
                    contractStartDate: form.value.contractStartDate,
                    contractEndDate: form.value.contractEndDate,
                    addressRequest: {
                        zipcode: form.value.zipcode,
                        addressRoad: form.value.addressRoad,
                        addressDetail: form.value.addressDetail
                    }
                }
            };

            const formData = new FormData();
            formData.append(
                    'memberWithFranchiseRequest',
                    new Blob([JSON.stringify(memberWithFranchiseRequest)], { type: 'application/json' })
            );
            if (form.value.agreementFile) {
                formData.append('agreementFile', form.value.agreementFile);
            }

            response = await franchiseMemberRegister(formData);
        }
        else if (form.value.authority === 'vendor-manager') {
            const memberWithVendorRequest = {
                memberCreateRequest,
                vendorCreateRequest: {
                    vendorName: form.value.vendorName,
                    vendorType: form.value.vendorType,
                    vendorTaxId: form.value.vendorTaxId.replace(/\D/g, ''),
                    vendorMemo: form.value.vendorMemo,
                    vendorStartDate: form.value.vendorStartDate,
                    vendorEndDate: form.value.vendorEndDate,
                    addressRequest: {
                        zipcode: form.value.zipcode,
                        addressRoad: form.value.addressRoad,
                        addressDetail: form.value.addressDetail
                    }
                }
            };

            const formData = new FormData();
            formData.append(
                    'memberWithVendorRequest',
                    new Blob([JSON.stringify(memberWithVendorRequest)], { type: 'application/json' })
            );
            if (form.value.agreementFile) {
                formData.append('agreementFile', form.value.agreementFile);
            }

            response = await vendorMemberRegister(formData);
        }
        else if (form.value.authority === 'warehouse-manager') {
            const warehouseCreateRequest = {
                warehouseName: form.value.warehouseName,
                addressRequest: {
                    zipcode: form.value.zipcode,
                    addressRoad: form.value.addressRoad,
                    addressDetail: form.value.addressDetail
                }
            };
            const payload = { memberCreateRequest, warehouseCreateRequest };
            response = await warehouseMemberRegister(payload);
        }

        console.log('회원 등록 성공', response);
        alert('회원 등록이 완료되었습니다.');
        await router.push('/member/list');
    } catch (error) {
        console.error('회원 등록 실패:', error);
        alert('회원 등록에 실패했습니다.');
    }
}

// 전화번호 하이픈 자동 처리
function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) {
        return cleaned;
    } else if (cleaned.length <= 6) {
        return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
    } else if (cleaned.length <= 10) {
        return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
    } else {
        return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7, 11);
    }
}

watch(
        () => form.value.phone,
        (newValue) => {
            if (!newValue) return;
            const formatted = formatPhoneNumber(newValue);
            if (formatted !== newValue) {
                form.value.phone = formatted;
            }
        }
);
</script>

<style scoped>
.register-member {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 24px;
    flex-wrap: wrap;
}

.signup-box {
    background: #fff;
    margin-top: 10px;
    padding: 24px;
    border-radius: 12px;
    width: 100%;
    max-width: 530px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
}

h2 {
    text-align: center;
    margin-bottom: 16px;
    font-weight: 700;
    color: #2e384d;
}

.form-group {
    margin-bottom: 12px;
}

label {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
}

input, select {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.9rem;
    border: 1px solid #ccd1d7;
    border-radius: 6px;
    background: #fff;
    color: #333;
    transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus {
    border-color: #3aaed8;
    outline: none;
    box-shadow: 0 0 0 2px rgba(58, 174, 216, 0.2);
}

select {
    appearance: none;
    background: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat;
    background-position: right 12px center;
    background-size: 16px 16px;
    padding-right: 40px;
}

.email-check-group {
    display: flex;
    gap: 8px;
}

.email-check-group input {
    flex: 1;
}

.check-btn {
    background: #3aaed8;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0 14px;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
}

.check-btn:hover {
    background: #1e8bc3;
}

button.submit-btn {
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    background: #3aaed8;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
}

button.submit-btn:hover:enabled {
    background: #1e8bc3;
}

button.submit-btn:disabled {
    background: #a0aec0;
    cursor: not-allowed;
}

.success-message {
    color: #2e7d32;
    font-size: 0.8rem;
    margin-top: 4px;
}

.error-message {
    color: #e53935;
    font-size: 0.8rem;
    margin-top: 4px;
}
</style>