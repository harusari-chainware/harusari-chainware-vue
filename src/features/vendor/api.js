import api from '@/api/axios.js'

// 거래처 목록 (검색용)
export const fetchVendors = (params) => api.get('/vendors', { params })

// 거래처 계약 상세
export const fetchVendorContractInfo = (vendorName) =>
    api.get(`/vendors/${encodeURIComponent(vendorName)}/contract-info`)

/* 컨텍스트 별로 각각 백엔드와 연결되는 api*/
export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`);
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`);
}

export const fetchVendors = (params) => {
    return api.get('/vendors', { params })
}