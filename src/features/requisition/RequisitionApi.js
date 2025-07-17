import api from '@/api/axios.js'

/* 컨텍스트 별로 각각 백엔드와 연결되는 api*/

export function getRequisitionList(params) {
    return api.get('/requisitions', { params });
}

export function getRequisitionById(requisitionId) {
    return api.get(`/requisitions/${requisitionId}`);
}

export function createRequisition(payload) {
    return api.post(`/requisitions`, payload)
}

export function submittedRequisition(requisitionId){
    return api.put(`/requisitions/${requisitionId}/submit`)
}

export const rejectRequisition = (requisitionId, reason) => {
    return api.put(`/requisitions/${requisitionId}/reject`, {
        rejectReason: reason
    })
}

export function approveRequisition(requisitionId){
    return api.put(`/requisitions/${requisitionId}/approve`)
}


export const deleteRequisition = (requisitionId) => {
    return api.delete(`/requisitions/${requisitionId}`)
}

export const updateRequisition = (requisitionId, payload) => {
    return api.put(`/requisitions/${requisitionId}`, payload)
}