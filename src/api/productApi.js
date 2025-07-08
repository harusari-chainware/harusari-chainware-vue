// src/api/productApi.js
import api from "@/api/axios.js";

/* ───────────── 제품(상품) 조회 API ───────────── */

/**
 * 제품 목록 조회 (검색 + 필터 + 페이징)
 * @param {object} params - 검색 및 필터 파라미터 (productName, productCode, categoryId, storeType, origin, shelfLife, topCategoryName, categoryName, createdAt, productStatusFilter, page, size)
 * @returns {Promise}
 */
export const fetchProducts = (params) => {
    return api.get("/api/v1/products", { params });
};

/**
 * 제품 상세 조회
 * @param {number} productId - 제품 ID
 * @param {number} page - 계약/벤더 페이징 (권한자만)
 * @param {number} size - 계약/벤더 페이징 (권한자만)
 * @returns {Promise}
 */
export const fetchProductDetail = (productId, page = 1, size = 10) => {
    return api.get(`/api/v1/products/${productId}`, {
        params: { page, size },
    });
};

// 전체 export 모듈
export default {
    fetchProducts,
    fetchProductDetail,
};
