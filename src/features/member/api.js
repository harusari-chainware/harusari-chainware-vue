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

export const checkEmailDuplicateApi = (email) => {
    return api.get('/members/email-exists', {
        params: {email}
    });
};

export const headquartersMemberRegister = (formData) => {
    return api.post("/members/headquarters", JSON.stringify(formData), {
        headers: {'Content-Type': 'application/json'}
    });
}

export const warehouseMemberRegister = (formData) => {
    return api.post("/members/warehouse", JSON.stringify(formData), {
        headers: {'Content-Type': 'application/json'}
    });
}

export const franchiseMemberRegister = (formData) => {
    return api.post("/members/franchise", formData, {
        headers: {'Content-Type': 'multipart/form-data'}
    });
};

export const vendorMemberRegister = (formData) => {
    return api.post("/members/vendor", formData, {
        headers: {'Content-Type': 'multipart/form-data'}
    });
}