<template>
    <div class="login-container">
        <div class="logo">
            <img :src="logo" alt="Chainware 로고"/>
        </div>
        <div class="divider"></div>
        <form @submit.prevent="handleLogin">
            <div class="input-group">
                <i class="fas fa-envelope input-icon"></i>
                <input type="text" v-model="email" placeholder="이메일" required/>
            </div>
            <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <i :class="showPassword ? 'fas fa-eye toggle-password' : 'fas fa-eye-slash toggle-password'"
                   @click="togglePassword"></i>
                <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="비밀번호" required/>
            </div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div class="options">
                <input type="checkbox" id="saveId" v-model="saveId" @change="handleSaveIdChange"/>
                <label for="saveId">아이디 저장</label>
            </div>
            <StatusButton type="primary" :disabled="isSubmitting" id="error-btn">로그인</StatusButton>
        </form>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import logo from '@/assets/images/chainware-logo.png';
import {useAuthStore} from '@/features/auth/useAuthStore';
import {loginApi} from '@/features/auth/api';
import {parseJwt} from '@/utils/jwt';
import StatusButton from "@/components/common/StatusButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const saveId = ref(authStore.saveId);
const errorMessage = ref('');
const isSubmitting = ref(false);

onMounted(() => {
    if (authStore.saveId && authStore.email) {
        email.value = authStore.email;
        saveId.value = true;
    }
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleSaveIdChange() {
    const trimmedEmail = email.value.trim();
    if (saveId.value) {
        if (trimmedEmail !== '' && isValidEmail(trimmedEmail)) {
            authStore.setEmail(trimmedEmail);
            authStore.setSaveId(true);
            errorMessage.value = '';
        } else {
            errorMessage.value = '올바른 이메일을 입력해주세요.';
            saveId.value = false;
        }
    } else {
        authStore.setEmail('');
        authStore.setSaveId(false);
        errorMessage.value = '';
    }
}

function togglePassword() {
    showPassword.value = !showPassword.value;
}

async function handleLogin() {
    isSubmitting.value = true;
    try {
        errorMessage.value = '';
        const res = await loginApi(email.value, password.value);

        if (res.success && res.data) {
            const {accessToken} = res.data;
            authStore.setAccessToken(accessToken);

            // JWT 디코드 후 authority 추출
            const decoded = parseJwt(accessToken);
            // console.log('Decoded JWT:', decoded); // 필요 시 확인 후 제거
            authStore.setAuthority(decoded.authority);

            if (saveId.value) {
                authStore.setEmail(email.value);
                authStore.setSaveId(true);
            } else {
                authStore.setEmail('');
                authStore.setSaveId(false);
            }

            await router.push('/dashboard/prediction');
        } else {
            errorMessage.value = res.message || '로그인에 실패했습니다.';
        }
    } catch (error) {
        console.error('로그인 실패:', error);
        errorMessage.value = error.response?.data?.message || '서버와 연결할 수 없습니다.';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

* {
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
}

.login-container {
    background: #ffffff;
    padding: 80px 50px;
    border-radius: 24px;
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 450px;
    min-height: 650px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.98);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.logo {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    width: 100%;
}

.logo img {
    width: 300px;
    height: auto;
    object-fit: contain;
}

.divider {
    width: 60px;
    height: 2px;
    background-color: #e0e6ed;
    border-radius: 1px;
    margin-bottom: 40px;
}

form {
    width: 100%;
}

.input-group {
    position: relative;
    margin-bottom: 20px;
}

.input-icon {
    position: absolute;
    top: 50%;
    left: 14px;
    transform: translateY(-50%);
    color: #8a8f99;
    font-size: 16px;
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #8a8f99;
    font-size: 16px;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 16px 16px 16px 46px;
    border: none;
    border-radius: 12px;
    background-color: #f1f3f5;
    font-size: 16px;
    color: #333;
    transition: box-shadow 0.2s, border 0.2s;
}

input::placeholder {
    color: #9ca3af;
}

input[type="text"]:focus,
input[type="password"]:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(58, 174, 216, 0.2);
}

.options {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #5e6b7a;
    margin-bottom: 50px;
}

.options input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 1.5px solid #c4cdd5;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
    position: relative;
    background-color: #fff;
}

.options input[type="checkbox"]:checked {
    background-color: #3aaed8;
    border-color: #3aaed8;
}

.options input[type="checkbox"]:checked::after {
    content: "\f00c";
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
    color: white;
    font-size: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#error-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #3aaed8, #48b6df);
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    box-shadow: 0 5px 15px rgba(58, 174, 216, 0.15);
}

button:hover {
    background: linear-gradient(135deg, #349ec5, #40a7cb);
    transform: scale(1.02);
}

button:active {
    transform: scale(0.98);
}

.error-message {
    color: #e02424;
    font-size: 14px;
    margin-bottom: 16px;
    text-align: center;
}
</style>