import api from '@/api/axios.js'

// 주문 목록 조회
export async function fetchOrders(params) {
    return await api.get('/orders', { params });
}

// 주문 상세 조회
export async function fetchOrderDetail(orderId) {
    return await api.get(`/orders/${orderId}`)
}

// 주문 등록 - 내 가맹점 정보 조회
export async function fetchMyFranchise() {
    return await api.get('/orders/my-franchise')
}

// 제품 목록 조회
export async function fetchProducts(params) {
    return await api.get('/products', { params })
}

// 주문 등록
export async function registerOrder(payload) {
    return await api.post('/orders', payload)
}