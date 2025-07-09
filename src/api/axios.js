import axios from "axios";
import router from "@/router";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// store를 주입받을 변수 선언
let authStore = null;

// 주입 함수
export function setAuthStore(store) {
    authStore = store;
}

// 요청 시 액세스 토큰 자동 삽입
api.interceptors.request.use(
        (config) => {
            if (!config.url.includes("/auth/refresh")) {
                if (authStore?.accessToken) {
                    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
);

// 401 시 리프레시 토큰 기반으로 1회 재발급 후 재시도
api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (!authStore) {
                return Promise.reject(error);
            }

            const originalRequest = error.config;

            if (originalRequest.url.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newAccessToken = await authStore.refreshToken();
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    authStore.clearAuth();
                    router.push('/login').then(() => {
                        window.location.reload();
                    });
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
);

export default api;