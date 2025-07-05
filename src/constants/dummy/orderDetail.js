// src/constants/dummy/orderDetail.js

export const dummyOrderDetail = {
    orderCode: 'OD-20250701-001',
    status: 'APPROVED',
    deliveryCode: 'DV-20250703-003',
    createdAt: '2025-07-01 09:00',
    updatedAt: '2025-07-02 14:00',
    deliveryCompletedAt: '2025-07-04 18:00',

    // 가맹점 정보
    franchiseName: '강남 1호점',
    franchisePhone: '02-987-6543',
    ownerName: '김점주',
    ownerPhone: '010-1234-5678',

    // 주문 정보 요약
    totalProductCount: 3,
    totalQuantity: 35,
    totalPrice: 565000,
    dueDate: '2025-09-13',

    // 배송 이력
    deliveryHistory: [
        { status: '주문 요청됨', handler: '김철수', date: '2025-07-01 10:00' },
        { status: '배송 요청됨', handler: '박영희', date: '2025-07-01 14:30' },
        { status: '배송 시작됨', handler: '이진우', date: '2025-07-02 09:15' },
        { status: '배송 완료됨', handler: '최수미', date: '2025-07-03 16:00' }
    ],

    // 반려 사유
    rejectReason: '납기일 선택이 올바르지 않습니다.',

    // 상세 품목
    items: [
        {
            productCode: 'PROD-001',
            productName: '프리미엄 원두',
            unit: '1kg',
            storeType: 'CHILLED',
            unitPrice: 35000,
            quantity: 10,
            totalPrice: 350000
        },
        {
            productCode: 'PROD-002',
            productName: '유기농 우유',
            unit: '1L',
            storeType: 'FROZEN',
            unitPrice: 4500,
            quantity: 20,
            totalPrice: 90000
        },
        {
            productCode: 'PROD-003',
            productName: '수제 초콜릿 세트',
            unit: '세트',
            storeType: 'ROOM_TEMPERATURE',
            unitPrice: 25000,
            quantity: 5,
            totalPrice: 125000
        },
        {
            productCode: 'PROD-001',
            productName: '프리미엄 원두',
            unit: '1kg',
            storeType: 'CHILLED',
            unitPrice: 35000,
            quantity: 10,
            totalPrice: 350000
        },
        {
            productCode: 'PROD-002',
            productName: '유기농 우유',
            unit: '1L',
            storeType: 'FROZEN',
            unitPrice: 4500,
            quantity: 20,
            totalPrice: 90000
        },
        {
            productCode: 'PROD-003',
            productName: '수제 초콜릿 세트',
            unit: '세트',
            storeType: 'ROOM_TEMPERATURE',
            unitPrice: 25000,
            quantity: 5,
            totalPrice: 125000
        },
        {
            productCode: 'PROD-001',
            productName: '프리미엄 원두',
            unit: '1kg',
            storeType: 'CHILLED',
            unitPrice: 35000,
            quantity: 10,
            totalPrice: 350000
        },
        {
            productCode: 'PROD-002',
            productName: '유기농 우유',
            unit: '1L',
            storeType: 'FROZEN',
            unitPrice: 4500,
            quantity: 20,
            totalPrice: 90000
        },
        {
            productCode: 'PROD-003',
            productName: '수제 초콜릿 세트',
            unit: '세트',
            storeType: 'ROOM_TEMPERATURE',
            unitPrice: 25000,
            quantity: 5,
            totalPrice: 125000
        },
        {
            productCode: 'PROD-001',
            productName: '프리미엄 원두',
            unit: '1kg',
            storeType: 'CHILLED',
            unitPrice: 35000,
            quantity: 10,
            totalPrice: 350000
        },
        {
            productCode: 'PROD-002',
            productName: '유기농 우유',
            unit: '1L',
            storeType: 'FROZEN',
            unitPrice: 4500,
            quantity: 20,
            totalPrice: 90000
        },
        {
            productCode: 'PROD-003',
            productName: '수제 초콜릿 세트',
            unit: '세트',
            storeType: 'ROOM_TEMPERATURE',
            unitPrice: 25000,
            quantity: 5,
            totalPrice: 125000
        },
    ]
}
