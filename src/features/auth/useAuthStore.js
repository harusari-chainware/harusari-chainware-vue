import { defineStore } from "pinia";
import router from "@/router";
import { refreshApi as refreshApi } from "@/features/auth/api.js";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: "",
        email: "",
        saveId: false,
    }),
    actions: {
        setAccessToken(token) {
            this.accessToken = token;
        },
        setEmail(email) {
            this.email = email;
        },
        setSaveId(save) {
            this.saveId = save;
        },
        clearAuth() {
            if (!this.saveId) {
                this.email = "";
            }
            this.accessToken = "";
        },
        async refreshToken() {
            try {
                const res = await refreshApi(); // 쿠키 기반 요청
                this.setAccessToken(res.data.accessToken); // 스토어 갱신
                return res.data.accessToken; // Axios 재시도에서 사용
            } catch (error) {
                console.error("refreshToken 실패:", error);
                this.clearAuth();
                await router.push("/login");
                throw error;
            }
        },
    },
    persist: true,
});