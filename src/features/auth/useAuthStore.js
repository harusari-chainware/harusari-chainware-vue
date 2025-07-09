import { defineStore } from "pinia";
import router from "@/router";
import { refreshApi } from "@/features/auth/api.js";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: "",
        email: "",
        saveId: false,
        authority: ""
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
        setAuthority(authority) {
            this.authority = authority;
        },
        clearAuth() {
            if (!this.saveId) {
                this.email = "";
            }
            this.accessToken = "";
            this.authority = "";
            localStorage.removeItem('auth');
        },
        async refreshToken() {
            try {
                const res = await refreshApi();
                this.setAccessToken(res.data.accessToken);
                return res.data.accessToken;
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