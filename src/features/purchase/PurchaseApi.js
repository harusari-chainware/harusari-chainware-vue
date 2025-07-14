import api from '@/api/axios.js'

/* 컨텍스트 별로 각각 백엔드와 연결되는 api*/

export function getPurchaseOrders(params) {
    return api.get('/purchases', { params })
}

export function getPurchaseOrderDetail(purchaseOrderId) {
    return api.get(`/purchases/${purchaseOrderId}`)
}