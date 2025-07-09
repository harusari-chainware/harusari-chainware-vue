import api from '@/api/axios.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/* 컨텍스트 별로 각각 백엔드와 연결되는 api*/
export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`);
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`);
}

export const getMembers = (params) => {
    return api.get(`${API_BASE_URL}/members`, { params })
}