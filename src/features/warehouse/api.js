import api from '@/api/axios.js'

export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`)
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`)
}

export const fetchWarehouses = (params) => {
    return api.get('/warehouse', { params })
}

// ✅ 보유 재고 API 추가
export const fetchInventories = (params) => {
    return api.get('/warehouse/inventory', { params })
}

export const fetchInventoryDetail = (inventoryId) => {
    return api.get(`/warehouse/inventory/${inventoryId}`)
}

export function fetchAllWarehouses() {
    return api.get('/warehouse/all').then(res => res.data.data);
}

export const fetchMyWarehouseId = () => {
    return api.get("/warehouse/my");
};

export const fetchSubCategories = async (topCategoryName) => {
    const res = await api.get("/categories", {
        params: { topCategoryName },
    });
    return (
        res.data.data.topCategories.find((top) => top.topCategoryName === topCategoryName)
            ?.categories || []
    );
};

export const fetchAllListTopCategories = async () => {
    const res = await api.get('/categories/top');
    return res.data.data;
};
