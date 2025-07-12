import api from '@/api/axios.js'

/* 컨텍스트 별로 각각 백엔드와 연결되는 api */
export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`);
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`);
}

/* 총 매출 통계 조회 API */
export function fetchTotalSales({ period = 'DAILY', franchiseId, targetDate }) {
    const params = { period };
    if (franchiseId) params.franchiseId = franchiseId;
    if (targetDate) params.targetDate = targetDate;

    return api.get('/statistics/total-sales', { params })
        .then(response => response.data.data);
}

/* 매출 패턴 통계 조회 API */
export function fetchSalesPattern({ period = 'HOURLY', franchiseId, targetDate }) {
    const params = { period };
    if (franchiseId) params.franchiseId = franchiseId;
    if (targetDate) params.targetDate = targetDate;

    return api.get('/statistics/patterns', { params })
        .then(response => response.data.data);
}

/**
 * 거래처 발주 통계 조회 API
 * @param {Object} params - { period, vendorId, targetDate, includeProduct }
 */
export function fetchPurchaseOrderStats(params) {
    return api.get('/statistics/purchase-order', { params })
        .then(res => res.data.data)
}

/**
 * 발주 추이 조회 API
 * @param {Object} params - { period, vendorId, targetDate }
 */
export function fetchPurchaseOrderTrend(params) {
    return api.get('/statistics/purchase-order/trend', { params })
        .then(res => res.data.data)
}

/**
 * 가맹점 주문 통계 조회 API
 * @param {Object} params - { period, franchiseId, targetDate, includeProduct }
 */
export function fetchStoreOrderStats(params) {
    return api.get('/statistics/store-order', { params })
        .then(res => res.data.data)
}

/**
 * 가맹점 주문 추이 조회 API
 * @param {Object} params - { period, franchiseId, targetDate }
 */
export function fetchStoreOrderTrend(params) {
    return api.get('/statistics/store-order/trend', { params })
        .then(res => res.data.data)
}

/**
 * 예측 vs 실적 비교 통계 조회 API
 * @param {string} predictionType - 'sales' | 'order_quantity' | 'purchase_quantity'
 * @param {string|number} franchiseId
 */
export async function fetchPredictionComparison(predictionType, franchiseId = '') {
    const params = { predictionType };
    if (franchiseId) params.franchiseId = franchiseId;

    return api.get('/statistics/prediction-comparison', { params })
        .then(res => res.data.data);
}

/**
 * 메뉴별 매출 통계 조회 API
 * @param {Object} params - { periodType, franchiseId, targetDate }
 */
export function fetchMenuSales(params) {
    return api.get('/statistics/menu-sales', { params })
        .then(res => res.data.data)
}

/**
 * 재고 회전율 추이 조회 API
 */
export function fetchInventoryTurnoverTrend({ period, franchiseId, warehouseId, targetDate }) {
    const params = { period }
    if (franchiseId) params.franchiseId = franchiseId
    if (warehouseId) params.warehouseId = warehouseId
    if (targetDate) params.targetDate = targetDate

    return api.get('/statistics/inventory-turnover/trend', { params })
        .then(res => res.data.data)
}

/**
 * 제품별 재고 회전율 조회 API
 */
export function fetchInventoryTurnover({ period, franchiseId, warehouseId, targetDate }) {
    const params = { period }
    if (franchiseId) params.franchiseId = franchiseId
    if (warehouseId) params.warehouseId = warehouseId
    if (targetDate) params.targetDate = targetDate

    return api.get('/statistics/inventory-turnover', { params })
        .then(res => res.data.data)
}

/**
 * 폐기율 추이 조회 API (전체 or 단일 대상)
 * @param {Object} params - { period, targetDate, warehouseId?, franchiseId? }
 */
export function fetchDisposalTrend({ period, targetDate, warehouseId, franchiseId }) {
    const params = { period };
    if (targetDate) params.targetDate = targetDate;
    if (warehouseId) params.warehouseId = warehouseId;
    if (franchiseId) params.franchiseId = franchiseId;

    return api.get('/statistics/disposal-rate/trend', { params })
        .then(res => res.data.data);
}

/**
 * 폐기율 통계 조회 API (상품별)
 * @param {Object} params - { period, targetDate, warehouseId?, franchiseId? }
 */
export function fetchDisposalRate({ period, targetDate, franchiseId, warehouseId }) {
    const params = { period, targetDate, includeProduct: true };
    if (warehouseId) params.warehouseId = warehouseId;
    if (franchiseId) params.franchiseId = franchiseId;

    return api.get('/statistics/disposal-rate', { params })
        .then(res => res.data.data);
}

/**
 * 예측 정확도 요약 조회 API
 * @param {string} predictionType - 'sales' | 'order' | 'purchase'
 * @param {string} periodType - 'DAILY' | 'WEEKLY' | 'MONTHLY'
 * @param {string} targetDate - 기준일 (예: '2025-07-06')
 * @param {number} [franchiseId] - 선택적 가맹점 ID
 */
/**
 * 예측 정확도 요약 조회 API
 * @param {Object} params - { predictionType, periodType, targetDate, franchiseId }
 */
export function fetchAccuracySummary({ predictionType = 'sales', periodType = 'DAILY', targetDate, franchiseId }) {
    const params = { predictionType, periodType };
    if (targetDate) params.targetDate = targetDate;
    if (franchiseId) params.franchiseId = franchiseId;

    return api.get('/accuracy/summary', { params })
        .then(res => res.data.data);
}

export function fetchAllWarehouses() {
    return api.get('/warehouse/all').then(res => res.data.data);
}

export function fetchAllFranchises() {
    return api.get('/franchises/all').then(res => res.data.data);
}

export function fetchAllVendors() {
    return api.get('/vendors/all').then(res => res.data.data);
}