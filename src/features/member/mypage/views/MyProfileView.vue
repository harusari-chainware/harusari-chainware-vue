<template>
    <DetailLayout
            title="내 프로필"
            description="회원님의 프로필 정보를 확인하고 수정할 수 있습니다."
    >
        <template #basic>
            <div v-if="isLoading">로딩 중...</div>
            <div v-else-if="member">
                <div class="detail-stack">
                    <div class="card">
                        <div class="section-header">
                            <div class="title-wrapper">
                                <div class="indicator"></div>
                                <h2 class="title">회원 정보</h2>
                            </div>

                            <div v-if="!isEditMode" class="button-group">
                                <button class="action-button" @click="enterEditMode">수정</button>
                            </div>

                            <div v-else class="edit-buttons">
                                <button class="action-button" @click="handleSave">저장</button>
                                <button class="cancel-button" @click="cancelEdit">취소</button>
                            </div>
                        </div>

                        <p class="description">회원 상세 내용을 확인할 수 있습니다.</p>

                        <div class="info-grid">
                            <div class="info-item" v-for="item in rows" :key="item.label">
                                <div class="label">{{ item.label }}</div>
                                <div class="value">
                                    <template v-if="item.editable && isEditMode">
                                        <InputField
                                                v-model="form[item.key]"
                                                :placeholder="item.label + '을(를) 입력하세요'"
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
                </div>
            </div>
            <div v-else>회원 정보를 불러올 수 없습니다.</div>
        </template>
    </DetailLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import InputField from '@/components/common/fields/InputField.vue'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import { getMyProfile, updateMyInfo } from '@/features/member/api.js'

const isLoading = ref(true)
const isEditMode = ref(false)
const member = ref(null)
const form = ref({ phoneNumber: '' })
const rows = ref([])

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
        default: return 'badge-default'
    }
}

const fetchProfile = async () => {
    isLoading.value = true
    try {
        const res = await getMyProfile()
        const data = res.data.data
        member.value = data

        rows.value = [
            { label: '이메일', value: data.email },
            { label: '이름', value: data.name },
            { label: '권한', value: data.authorityLabelKr, type: 'badge', badgeClass: authorityBadgeClass(data.authorityLabelKr) },
            {
                label: '전화번호',
                value: formatPhoneNumber(data.phoneNumber),
                editable: true,
                key: 'phoneNumber'
            },
            { label: '생년월일', value: data.birthDate },
            { label: '직책', value: data.position }
        ]

        form.value.phoneNumber = formatPhoneNumber(data.phoneNumber)
    } catch (err) {
        console.error('프로필 조회 실패:', err)
    } finally {
        isLoading.value = false
    }
}

const enterEditMode = () => {
    isEditMode.value = true
}

const cancelEdit = () => {
    isEditMode.value = false
    form.value.phoneNumber = formatPhoneNumber(member.value.phoneNumber)
}

const handleSave = async () => {
    if (!form.value.phoneNumber) {
        alert('전화번호를 입력해주세요.')
        return
    }

    const payload = {
        phoneNumber: form.value.phoneNumber.replace(/\D/g, '')
    }

    try {
        await updateMyInfo(payload)
        alert('전화번호가 수정되었습니다.')
        isEditMode.value = false
        await fetchProfile()
    } catch (err) {
        console.error('전화번호 수정 실패:', err)
        alert('전화번호 수정에 실패했습니다.')
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

onMounted(fetchProfile)
</script>

<style scoped>
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
    word-break: break-word;
}

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

.detail-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #fff;
    display: inline-block;
    text-align: center;
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
</style>