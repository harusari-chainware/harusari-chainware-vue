import api from "@/api/axios.js";

/* ───────────── 계약(Contract) 커맨드 API ───────────── */

// 계약 등록
export const createContract = (contractData) => {
    return api.post('/contract', contractData);
};

// 계약 수정
export const updateContract = (contractId, contractData) => {
    return api.put(`/contract/${contractId}`, contractData);
};

// 계약 삭제
export const deleteContract = (contractId) => {
    return api.delete(`/contract/${contractId}`);
};

/* ───────────── 계약(Contract) 조회 API ───────────── */

/**
 * 계약 목록 조회 (검색, 필터, 페이징)
 * @param {object} params - 검색/필터 파라미터 (productName, topCategoryName, categoryName, vendorName, vendorType, contractStatus, contractStartDate, contractEndDate, page, size)
 * @returns {Promise}
 */
export const fetchContracts = (params) => {
    return api.get("/contracts", { params });
};

/**
 * 계약 상세 조회
 * @param {number} contractId - 계약 ID
 * @returns {Promise}
 */
export const fetchContractDetail = (contractId) => {
    return api.get(`/contracts/${contractId}`);
};

export default {
    createContract,
    updateContract,
    deleteContract,
    fetchContracts,
    fetchContractDetail,
};
