import api from '@/api/axios.js'

/* 컨텍스트 별로 각각 백엔드와 연결되는 api */
export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`);
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`);
}

export function fetchTakeBacks(params) {
    return api.get('/takeback', { params });
}

export function fetchTakeBackDetail(id) {
    return api.get(`/takeback/${id}`);
}

export function approveTakeBackAPI(id) {
    return api.put(`/takeback/${id}/approve`, {});  // ✅ 빈 body 명시
}

export function rejectTakeBackAPI(id, request) {
    return api.put(`/takeback/${id}/reject`, request);  // ✅ request: { reason: '...' }
}

export function collectTakeBackAPI(id) {
    return api.put(`/takeback/${id}/collect`, {});  // ✅ 빈 body 명시
}

export function fetchAllWarehouses() {
    return api.get('/warehouse/all').then(res => res.data.data);
}

export function fetchAllFranchises() {
    return api.get('/franchises/all').then(res => res.data.data);
}
