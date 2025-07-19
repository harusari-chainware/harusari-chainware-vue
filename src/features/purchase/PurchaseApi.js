import api from '@/api/axios.js'

/* 컨텍스트 별로 각각 백엔드와 연결되는 api*/

export function getPurchaseOrders(params) {
    return api.get('/purchases', { params })
}

export function getPurchaseOrderDetail(purchaseOrderId) {
    return api.get(`/purchases/${purchaseOrderId}`)
}

export function approvePurchase(purchaseOrderId){
    return api.put(`/purchases/${purchaseOrderId}/approve`)
}

export const rejectPurchase = (purchaseOrderId, reason) => {
    return api.put(`/purchases/${purchaseOrderId}/reject`, {
        rejectReason: reason
    })
}

// 추가: 발주서 수정
export const updatePurchaseOrder = (purchaseOrderId, data) => {
    return api.put(`/purchases/${purchaseOrderId}`, data)
}

// 추가: 발주서 취소
export const cancelPurchaseOrder = (purchaseOrderId, reason) => {
    return api.put(`/purchases/${purchaseOrderId}/cancel`, {
        cancelReason: reason
    })
}

// 추가: 출고 처리
export const shippedPurchaseOrder = (purchaseOrderId) => {
    return api.put(`/purchases/${purchaseOrderId}/shipped`)
}

// 추가: 입고 처리
export const inboundPurchaseOrder = (purchaseOrderId, payload) => {
    return api.put(`/purchases/${purchaseOrderId}/inbound`, payload)
}
