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