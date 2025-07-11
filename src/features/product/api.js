import api from "@/api/axios.js";

/* ───────────── 제품(상품) 커맨드 API ───────────── */

// 제품 등록
export const createProduct = (productData) => {
    return api.post('/product', productData); // 단수
};

// 제품 수정
export const updateProduct = (productId, productData) => {
    return api.put(`/product/${productId}`, productData); // 단수 + PK path param
};

// 제품 상태만 수정 (PUT, body 사용)
export const updateProductStatus = (productId, productStatus) => {
    return api.put(`/product/${productId}`, { productStatus });
    // body: { productStatus: 0 } 또는 { productStatus: 1 }
};

// 제품 삭제 (Soft Delete 또는 실제 삭제)
export const deleteProduct = (productId) => {
    return api.delete(`/product/${productId}`); // 단수 + PK
};

/* ───────────── 제품(상품) 조회 API ───────────── */

/**
 * 제품 목록 조회 (검색 + 필터 + 페이징)
 * @param {object} params - 검색 및 필터 파라미터 (productName, productCode, categoryId, storeType, origin, shelfLife, topCategoryName, categoryName, createdAt, productStatusFilter, page, size)
 * @returns {Promise}
 */
export const fetchProducts = (params) => {
    return api.get("/products", { params });
};

/**
 * 제품 상세 조회
 * @param {number} productId - 제품 ID
 * @param {number} page - 계약/벤더 페이징 (권한자만)
 * @param {number} size - 계약/벤더 페이징 (권한자만)
 * @returns {Promise}
 */
export const fetchProductDetail = (productId, page = 1, size = 10) => {
    return api.get(`/products/${productId}`, {
        params: { page, size },
    });
};

// 전체 export 모듈
export default {
    fetchProducts,
    fetchProductDetail,
};
