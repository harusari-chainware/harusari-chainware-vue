import api from '@/api/axios.js'

// 배송 목록 조회
export async function fetchDeliveries(params) {
    return await api.get('/delivery', { params })
}

// 배송 상세 조회
export async function fetchDeliveryDetail(deliveryId) {
    return await api.get(`/delivery/${deliveryId}`)
}