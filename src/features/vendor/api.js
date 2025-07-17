import api from '@/api/axios.js'

// 거래처 목록 (검색용)
export const fetchVendors = (params) => api.get('/vendors', { params })

export const fetchVendorById = (vendorId) =>
    api.get(`/vendors/${vendorId}`)

// 거래처 계약 상세
export const fetchVendorContractInfo = (vendorName) =>
    api.get(`/vendors/${encodeURIComponent(vendorName)}/contract-info`)

// 거래처 계약서 Presigned URL (다운로드)
export const fetchVendorAgreementDownloadUrl = (vendorId) =>
    api.get(`/vendors/${vendorId}/agreement/download`)

// 전체 거래처 목록 (드롭다운 등 단순 리스트용)
export const fetchAllVendors = () => api.get('/vendors/all')

// 거래처 계약 정보(계약 등록/수정용, vendorName으로 조회)
export const fetchVendorContract = (vendorName) =>
    api.get(`/vendors/${encodeURIComponent(vendorName)}/contract-info`)

// 거래처 정보 수정 (계약서 파일 포함 가능)
export const updateVendor = (vendorId, vendorUpdateRequest, agreementFile) => {
    const formData = new FormData()
    formData.append('vendorUpdateRequest', new Blob(
        [JSON.stringify(vendorUpdateRequest)], { type: 'application/json' }
    ))
    if (agreementFile) formData.append('agreementFile', agreementFile)

    return api.put(`/vendors/${vendorId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}