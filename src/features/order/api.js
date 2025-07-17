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

// 제품 목록 조회 (상태 필터 포함)
export async function fetchActiveProducts(params = {}) {
    return await api.get('/products', {
        params: {
            productStatusFilter: 'ACTIVE_ONLY',
            ...params
        }
    });
}

// 주문 등록
export async function registerOrder(payload) {
    return await api.post('/orders', payload)
}

// 주문 수정
export async function updateOrder(orderId, payload) {
    return await api.put(`/orders/${orderId}`, payload);
}

// 주문 취소
export async function cancelOrder(orderId) {
    return await api.put(`/orders/${orderId}/cancel`);
}

// 주문 승인
export async function approveOrder(orderId, payload) {
    return await api.put(`/orders/${orderId}/approve`, payload);
}

// 주문 반려
export async function rejectOrder(orderId, payload) {
    return await api.put(`/orders/${orderId}/reject`, payload);
}

// 주문 승인 가능 창고 목록 조회
export async function fetchAvailableWarehouses(orderId) {
    return await api.get(`/orders/${orderId}/available-warehouses`);
}