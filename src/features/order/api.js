import api from '@/api/axios.js'

// 주문 목록 조회
export async function fetchOrders(params) {
    return await api.get('/orders', { params });
}

// 주문 상세 조회
export async function fetchOrderDetail(orderId) {
    return await api.get(`/orders/${orderId}`)
}