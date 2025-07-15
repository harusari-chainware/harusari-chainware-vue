import api from '@/api/axios.js'

/* 📌 더미용 테스트 API */
export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`);
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`);
}

/* 📦 폐기 등록 API (일반 폐기 & 반품 폐기 공통) */
export function registerNormalDisposalAPI(payload) {
    return api.post('/disposal', payload);
}

export function registerTakebackDisposalAPI(payload) {
    return api.post('/disposal', payload);
}

/* 📋 폐기 조회 API (최근 폐기 내역 조회 - 대시보드) */
export function fetchRecentDisposalsAPI() {
    return api.get('/disposal', {
        params: {
            page: 1,
            size: 5
        }
    });
}

/* 🔍 폐기 검색 조회 API (검색 조건 기반 조회 - 폐기 이력 화면) */
export function searchDisposalsAPI(searchParams) {
    return api.get('/disposal', {
        params: searchParams
    });
}

/* 🔍 폐기 등록 시 상품 검색 API (창고/가맹점 관리자용) */
export function searchDisposalProductsAPI(params) {
    return api.get('/disposal/search', { params });
}

/* 📦 반품 폐기 등록 시 반품 상품 목록 조회 API */
export function fetchTakebackProductsAPI(takeBackId) {
    return api.get(`/disposal/products/takeback/${takeBackId}`);
}

/* 🔍 반품 코드 검색 API (반품 폐기 시 검색 자동완성용) */
export function searchTakeBackCodesAPI(keyword) {
    return api.get('/disposal/takebacks/search', {
        params: { keyword }
    });
}

export function fetchAllWarehouses() {
    return api.get('/warehouse/all').then(res => res.data.data);
}

export function fetchAllFranchises() {
    return api.get('/franchises/all').then(res => res.data.data);
}
