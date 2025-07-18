<template>
    <div class="card">
        <div class="section-header">
            <div class="title-wrapper">
                <div class="indicator"></div>
                <h2 class="title">회원 정보</h2>
            </div>
            <div v-if="!isEditMode" class="button-group">
                <button class="action-button" @click="enterEditMode">수정</button>
                <button class="delete-button" @click="handleDelete">탈퇴</button>
            </div>
            <div v-else class="edit-buttons">
                <button class="action-button" @click="handleSave">저장</button>
                <button class="cancel-button" @click="cancelEdit">취소</button>
            </div>
        </div>
        <p class="description">회원 상세 내용을 확인할 수 있습니다.</p>

        <div class="info-grid">
            <div v-for="item in rows" :key="item.label" class="info-item">
                <div class="label">{{ item.label }}</div>
                <div class="value">
                    <template v-if="item.editable && isEditMode">
                        <InputField
                                v-if="item.type !== 'select'"
                                v-model="form[item.key]"
                                :placeholder="item.label + '을(를) 입력하세요'"
                        />
                        <SelectField
                                v-else
                                v-model="form[item.key]"
                                :options="authorityOptions"
                                placeholder="권한을 선택하세요"
                                required
                        />
                    </template>
                    <template v-else-if="item.type === 'badge'">
                        <span :class="['badge', item.badgeClass]">{{ item.value }}</span>
                    </template>
                    <template v-else>
                        {{ item.value || '-' }}
                    </template>
                </div>
            </div>
        </div>
    </div>
    <ConfirmModal ref="alertModal" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/common/fields/InputField.vue'
import SelectField from '@/components/common/fields/SelectField.vue'
import { updateMember, deleteMember } from '@/features/member/api.js'
import ConfirmModal from "@/features/member/mypage/components/ConfirmModal.vue";

const props = defineProps({
    member: { type: Object, required: true }
})

const emit = defineEmits(['refresh'])
const router = useRouter()
const isEditMode = ref(false)
const alertModal = ref(null);

const form = ref({
    name: '',
    authorityName: '',
    phoneNumber: '',
    position: ''
})

const authorityOptions = [
    { label: '마스터', value: 'MASTER' },
    { label: '일반 관리자', value: 'GENERAL_MANAGER' },
    { label: '책임 관리자', value: 'SENIOR_MANAGER' },
    { label: '창고 관리자', value: 'WAREHOUSE_MANAGER' },
    { label: '가맹점 담당자', value: 'FRANCHISE_MANAGER' },
    { label: '거래처 담당자', value: 'VENDOR_MANAGER' },
    { label: '시스템', value: 'SYSTEM' },
    { label: '최고 관리자', value: 'SUPER_ADMIN' }

]

const labelToValueMap = {
    '마스터': 'MASTER',
    '일반 관리자': 'GENERAL_MANAGER',
    '책임 관리자': 'SENIOR_MANAGER',
    '창고 관리자': 'WAREHOUSE_MANAGER',
    '가맹점 담당자': 'FRANCHISE_MANAGER',
    '거래처 담당자': 'VENDOR_MANAGER',
    '시스템': 'SYSTEM',
    '최고 관리자': 'SUPER_ADMIN'
}

function formatDateTime(dateTime) {
    if (!dateTime) return '-'
    const date = new Date(dateTime)
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
}

function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '-'
    const cleaned = phoneNumber.replace(/\D/g, '')
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    }
    return phoneNumber
}

function authorityBadgeClass(label) {
    switch (label) {
        case '마스터': return 'badge-master'
        case '일반 관리자': return 'badge-general'
        case '책임 관리자': return 'badge-senior'
        case '창고 관리자': return 'badge-warehouse'
        case '가맹점 담당자': return 'badge-franchise'
        case '거래처 담당자': return 'badge-vendor'
        case '시스템': return 'badge-system'
        case '최고 관리자': return 'badge-super'
        default: return 'badge-default'
    }
}

const rows = [
    { label: '회원 ID', value: props.member.memberId },
    { label: '이메일', value: props.member.email },
    { label: '이름', value: props.member.name, editable: true, key: 'name' },
    {
        label: '권한',
        value: props.member.authorityLabelKr,
        editable: true,
        type: 'select',
        key: 'authorityName',
        badgeClass: authorityBadgeClass(props.member.authorityLabelKr)
    },
    { label: '전화번호', value: formatPhoneNumber(props.member.phoneNumber), editable: true, key: 'phoneNumber' },
    { label: '생년월일', value: props.member.birthDate },
    { label: '직책', value: props.member.position, editable: true, key: 'position' },
    { label: '가입일', value: formatDateTime(props.member.joinAt) },
    { label: '수정일', value: formatDateTime(props.member.modifiedAt) },
    {
        label: '탈퇴 여부',
        value: props.member.isDeleted ? '탈퇴' : '활동 중',
        type: 'badge',
        badgeClass: props.member.isDeleted ? 'badge-inactive' : 'badge-active'
    }
]

const enterEditMode = () => {
    isEditMode.value = true
    form.value = {
        name: props.member.name ?? '',
        authorityName: labelToValueMap[props.member.authorityLabelKr] ?? 'MASTER',
        phoneNumber: formatPhoneNumber(props.member.phoneNumber ?? ''),
        position: props.member.position ?? ''
    }
}

const cancelEdit = () => {
    isEditMode.value = false
}

const handleSave = async () => {
    if (!form.value.authorityName) {
        await alertModal.value.open('권한을 선택해주세요.')
        return
    }

    try {
        const payload = {
            ...form.value,
            phoneNumber: form.value.phoneNumber.replace(/\D/g, '')
        }
        await alertModal.value.open('회원 정보를 수정하시겠습니까?')
        await updateMember(props.member.memberId, payload)
        emit('refresh')
        isEditMode.value = false
    } catch (error) {
        console.error('회원 정보 수정 실패:', error)
        await alertModal.value.open('회원 정보 수정에 실패했습니다.')
    }
}

const handleDelete = async () => {
    try {
        await alertModal.value.open('정말로 이 회원을 탈퇴 처리하시겠습니까?')
        await deleteMember(props.member.memberId)
        await alertModal.value.open('회원이 탈퇴 처리되었습니다.')
        await router.push('/member/list')
    } catch (error) {
        console.error('회원 탈퇴 실패:', error)
        await alertModal.value.open('회원 탈퇴 처리에 실패했습니다.')
    }
}

watch(() => form.value.phoneNumber, (val) => {
    if (!val) return
    const digits = val.replace(/\D/g, '')
    if (digits.length <= 3) {
        form.value.phoneNumber = digits
    } else if (digits.length <= 7) {
        form.value.phoneNumber = digits.replace(/(\d{3})(\d{1,4})/, '$1-$2')
    } else {
        form.value.phoneNumber = digits.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3')
    }
})
</script>

<style scoped>
.button-group,
.edit-buttons {
    display: flex;
    gap: 7px;
}

.action-button {
    padding: 6px 14px;
    background-color: var(--color-primary, #2F80ED);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
    cursor: pointer;
}

.delete-button {
    padding: 6px 14px;
    background-color: #f94144;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
    cursor: pointer;
}

.delete-button:hover {
    background-color: #e63b3b;
}

.cancel-button {
    padding: 6px 14px;
    background-color: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
    cursor: pointer;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    max-width: 1500px;
    margin: 0 auto;
    width: 100%;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.title-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title {
    font-size: var(--font-page-title-large);
    font-weight: bold;
    color: var(--color-gray-900);
    margin-bottom: 4px;
    border-left: 4px solid var(--color-primary);
    padding-left: 10px;
}

.description {
    font-size: 0.95rem;
    color: #6c757d;
    margin-bottom: 16px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
}

.info-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
}

.label {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 4px;
}

.value {
    font-weight: 600;
    color: #212529;
    word-break: break-all;
}

.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #fff;
    display: inline-block;
    text-align: center;
}

.badge-active {
    background-color: #17c3b2;
}

.badge-inactive {
    background-color: #fe6d73;
}

.badge-master {
    background-color: #ef476f;
}

.badge-general {
    background-color: #ffd166;
}

.badge-senior {
    background-color: #06d6a0;
}

.badge-warehouse {
    background-color: #118ab2;
}

.badge-franchise {
    background-color: #073b4c;
}

.badge-vendor {
    background-color: #7678ed;
}

.badge-system {
    background-color: #6c5ce7;
}

.badge-default {
    background-color: #9ca3af;
}

.badge-super {
  background-color: #7fb7ca;
}
</style>
