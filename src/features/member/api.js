import api from '@/api/axios.js'

export const getMembers = (params) => {
    return api.get("/members", {params})
}

export const getMemberDetail = (memberId) => {
    return api.get(`/members/${memberId}`)
}

export const getMemberLoginHistory = (memberId, params) => {
    return api.get(`/members/${memberId}/login-history`, {params})
}

export const updateMember = (memberId, params) => {
    return api.put(`/members/${memberId}`, params)
}

export const deleteMember = (memberId) => {
    return api.delete(`/members/${memberId}`);
}