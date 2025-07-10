import api from '@/api/axios.js'

// 주문 목록 조회
export async function fetchOrders(params) {
    return await api.get('/orders', { params });
}