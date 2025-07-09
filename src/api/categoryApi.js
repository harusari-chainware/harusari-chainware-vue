import api from "@/api/axios.js";

/* ───────────── 카테고리 커맨드 API ───────────── */

// 카테고리 생성
export const createCategory = (categoryData) => {
    return api.post("/api/v1/category", categoryData);
};

// 카테고리 수정
export const updateCategory = (categoryId, data) => {
    return api.put(`/api/v1/category/${categoryId}`, data);
};

// 카테고리 삭제
export const deleteCategory = (categoryId) => {
    return api.delete(`/api/v1/category/${categoryId}`);
};

/* ───────────── 상위 카테고리 커맨드 API ───────────── */

// 상위 카테고리 생성
export const createTopCategory = (topCategoryData) => {
    return api.post("/api/v1/topcategory", topCategoryData);
};

// 상위 카테고리 수정
export const updateTopCategory = (topCategoryId, data) => {
    return api.put(`/api/v1/topcategory/${topCategoryId}`, data);
};

// 상위 카테고리 삭제
export const deleteTopCategory = (topCategoryId) => {
    return api.delete(`/api/v1/topcategory/${topCategoryId}`);
};

/* ───────────── 카테고리 조회 API ───────────── */

// 전체 카테고리 목록 조회 (검색 + 페이징)
export const fetchCategories = (params) => {
    return api.get("/api/v1/categories", { params });
};

// 특정 상위 카테고리의 제품 목록 조회 (제품 기준 페이징)
export const fetchTopCategoryWithProducts = (topCategoryId, page = 1, size = 10) => {
    return api.get(`/api/v1/categories/top/${topCategoryId}`, {
        params: { page, size },
    });
};

// 특정 카테고리 상세 조회 (제품 목록 포함, 제품 기준 페이징)
export const fetchCategoryDetail = (categoryId, page = 1, size = 10) => {
    return api.get(`/api/v1/categories/${categoryId}`, {
        params: { page, size },
    });
};

// 전체 상위 + 하위 카테고리 목록 조회 (categories 포함)
export const fetchTopCategoriesWithChildren = (page = 1, size = 10) => {
    return api.get('/api/v1/categories', {
        params: { page, size },
    })
}

// 특정 상위 카테고리명 기준으로 하위 카테고리만 가져오기
export const fetchSubCategories = async (topCategoryName) => {
    const res = await api.get("/api/v1/categories", {
        params: { topCategoryName },
    });
    return (
        res.data.data.topCategories.find((top) => top.topCategoryName === topCategoryName)
            ?.categories || []
    );
};

// export const fetchAllTopCategories = () => {
//     return api.get("/api/v1/categories");
// };

export const fetchAllTopCategories = () => {
    return api.get("/api/v1/categories", { params: { page: 1, size: 100 } }); // size 크게!
};

export const fetchAllListTopCategories = () => {
    return api.get('/api/v1/categories/top');
};

// 전체 export 모듈
export default {
    // 커맨드
    createCategory,
    updateCategory,
    deleteCategory,
    createTopCategory,
    updateTopCategory,
    deleteTopCategory,

    // 조회
    fetchCategories,
    fetchTopCategoryWithProducts,
    fetchCategoryDetail,
    fetchSubCategories,
    fetchAllTopCategories,
};
