<template>
    <div class="card">
        <div class="section-header">
            <div class="title-wrapper">
                <div class="indicator"></div>
                <h2 class="title">회원 정보</h2>
            </div>
            <RouterLink :to="`/member/${props.member.memberId}/edit`" class="action-button">
                수정
            </RouterLink>
        </div>
        <p class="description">회원 상세 내용을 확인할 수 있습니다.</p>

        <div class="info-grid">
            <div v-for="item in rows" :key="item.label" class="info-item">
                <div class="label">{{ item.label }}</div>
                <div class="value">
                    <template v-if="item.type === 'badge'">
                        <span :class="['badge', item.badgeClass]">{{ item.value }}</span>
                    </template>
                    <template v-else>
                        {{ item.value || '-' }}
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    member: {type: Object, required: true}
})

function formatDateTime(dateTime) {
    if (!dateTime) return '-'
    const date = new Date(dateTime)
    return date.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})
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
        case '마스터':
            return 'badge-master'
        case '일반 관리자':
            return 'badge-general'
        case '책임 관리자':
            return 'badge-senior'
        case '창고 관리자':
            return 'badge-warehouse'
        case '가맹점 담당자':
            return 'badge-franchise'
        case '거래처 담당자':
            return 'badge-vendor'
        default:
            return 'badge-default'
    }
}

const rows = [
    {label: '회원 ID', value: props.member.memberId},
    {label: '이메일', value: props.member.email},
    {label: '이름', value: props.member.name},
    {
        label: '권한',
        value: props.member.authorityLabelKr,
        type: 'badge',
        badgeClass: authorityBadgeClass(props.member.authorityLabelKr)
    },
    {label: '전화번호', value: formatPhoneNumber(props.member.phoneNumber)},
    {label: '생년월일', value: props.member.birthDate},
    {label: '직책', value: props.member.position},
    {label: '가입일', value: formatDateTime(props.member.joinAt)},
    {label: '수정일', value: formatDateTime(props.member.modifiedAt)},
    {
        label: '탈퇴 여부',
        value: props.member.isDeleted ? '탈퇴' : '활동 중',
        type: 'badge',
        badgeClass: props.member.isDeleted ? 'badge-inactive' : 'badge-active'
    },
]
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

.action-button {
    padding: 6px 14px;
    background-color: var(--color-primary, #2F80ED);
    color: #fff;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
}

.action-button:hover {
    background-color: var(--color-primary-dark, #1c60b3);
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

/* 탈퇴 여부 배지 */
.badge-active {
    background-color: #17c3b2;
}

.badge-inactive {
    background-color: #fe6d73;
}

/* 권한 배지 색상 */
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

.badge-default {
    background-color: #9ca3af;
}
</style>
