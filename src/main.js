import './assets/css/global.css'
import './assets/css/variables.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setAuthStore } from "@/api/axios.js";
import { useAuthStore } from "@/features/auth/useAuthStore.js";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);

app.use(pinia);
app.use(router);

app.mount('#app');

const authStore = useAuthStore();
setAuthStore(authStore);
