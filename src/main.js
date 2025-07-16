import './assets/css/global.css'
import './assets/css/variables.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'vue-toastification/dist/index.css'
import './assets/css/toast.css'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'

import App from './App.vue'
import router from './router'
import { setAuthStore } from "@/api/axios.js";
import { useAuthStore } from "@/features/auth/useAuthStore.js";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);

app.use(pinia);
app.use(router);

app.use(Toast, {
    position: 'top-center', // ✅ 중앙 상단
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    hideProgressBar: false
})

app.mount('#app');

const authStore = useAuthStore();
setAuthStore(authStore);
