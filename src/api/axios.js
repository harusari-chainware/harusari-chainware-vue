import axios from 'axios'
import { useAuthStore } from '@/features/auth/useAuthStore' // Pinia store import

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
        (config) => {
            const authStore = useAuthStore(); // Pinia store 인스턴스 생성
            const token = authStore.accessToken; // Pinia에서 직접 가져오기

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
);

export default api;
