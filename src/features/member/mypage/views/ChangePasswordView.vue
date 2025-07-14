<template>
    <DetailLayout
            title="비밀번호 변경"
            description="회원 비밀번호를 변경할 수 있습니다."
    >
        <template #basic>
            <transition name="fade-slide" appear>
                <div class="card">
                    <form @submit.prevent="handleSubmit" class="form-stack">
                        <!-- 현재 비밀번호 -->
                        <div class="form-group">
                            <label>현재 비밀번호</label>
                            <input
                                    v-model="form.currentPassword"
                                    type="password"
                                    placeholder="현재 비밀번호 입력"
                            />
                            <p v-if="currentError" class="error-text">{{ currentError }}</p>
                        </div>

                        <!-- 새 비밀번호 -->
                        <div class="form-group">
                            <label>새 비밀번호</label>
                            <input
                                    v-model="form.newPassword"
                                    type="password"
                                    placeholder="새 비밀번호 입력 (8자리 이상)"
                            />
                            <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
                        </div>

                        <!-- 새 비밀번호 확인 -->
                        <div class="form-group">
                            <label>새 비밀번호 확인</label>
                            <input
                                    v-model="form.confirmPassword"
                                    type="password"
                                    placeholder="새 비밀번호 재입력"
                            />
                            <p v-if="confirmError" class="error-text">{{ confirmError }}</p>
                        </div>

                        <button type="submit" class="submit-button">
                            비밀번호 변경
                        </button>
                    </form>
                </div>
            </transition>
        </template>
    </DetailLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import { changePassword } from '@/features/member/api.js'

const router = useRouter()

const form = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

const currentError = ref('')
const passwordError = ref('')
const confirmError = ref('')

const validatePassword = (password) => password.length >= 8

const handleSubmit = async () => {
    currentError.value = ''
    passwordError.value = ''
    confirmError.value = ''

    if (!form.currentPassword) {
        currentError.value = '현재 비밀번호를 입력하세요.'
        return
    }

    if (!validatePassword(form.newPassword)) {
        passwordError.value = '비밀번호는 8자리 이상이어야 합니다.'
        return
    }

    if (form.newPassword !== form.confirmPassword) {
        confirmError.value = '새 비밀번호와 확인이 일치하지 않습니다.'
        return
    }

    try {
        await changePassword(form)
        alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.')
        await router.push('/login')
    } catch (error) {
        const message = error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
        alert(message)
    }
}
</script>

<style scoped>
/* 애니메이션 정의 */
.fade-slide-enter-active {
    animation: fadeSlideIn 0.4s ease-out both;
}

@keyframes fadeSlideIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 40px 24px; /* 상하 여백을 키움 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    min-width: 500px;
    max-width: 600px;
    margin: 100px auto;

    min-height: 280px; /* 카드 기본 세로 길이 */
}

.form-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
    margin-bottom: 4px;
}

input {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 4px;
}

input:focus {
    border-color: var(--color-primary);
    outline: none;
}

.submit-button {
    padding: 10px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 10px;
}

.submit-button:hover {
    background-color: var(--color-primary-dark, #2c91bc);
}

.error-text {
    color: red;
    font-size: 0.8rem;
    margin: 0;
}
</style>
