import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        email: '',
        saveId: false,
        accessToken: '',
        refreshToken: '',
    }),
    actions: {
        setEmail(email) {
            this.email = email
        },
        setSaveId(save) {
            this.saveId = save
        },
        setTokens({ accessToken, refreshToken }) {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
        },
        clearAuth() {
            this.email = ''
            this.saveId = false
            this.accessToken = ''
            this.refreshToken = ''
        }
    },
    persist: true,
})
