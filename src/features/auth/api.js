import api from "@/api/axios.js";

export async function loginApi(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
}

export async function logoutApi() {
    const response = await api.post("/auth/logout");
    return response.data;
}

export async function refreshApi() {
    const response = await api.post("/auth/refresh");
    return response.data;
}