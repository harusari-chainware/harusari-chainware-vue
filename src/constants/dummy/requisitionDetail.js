// src/constants/dummy/purchaseDetail.js

export const dummyPurchaseDetail = {
    purchaseCode: 'PO-20250701-001',
    status: 'REQUESTED',
    requisitionCode: 'RQ-250701001',
    createdAt: '2025-07-01 10:00',
    updatedAt: '2025-07-02 09:00',
    warehousedAt: '',
    dueDate: '2025-07-10',

    drafterName: '김영수',
    drafterPosition: '구매 담당자',
    drafterEmail: 'ys.kim@company.com',



    approverName: '이부장',
    approverPosition: '구매팀장',
    approverEmail: 'manager.lee@company.com',


    vendorName: '(주)커피창고',
    vendorType: '공급업체',
    vendorManagerName: '홍길동',
    vendorContact: '010-2222-3333',


    warehouseName: '서울 1창고',
    warehouseLocation: '서울특별시 중구 창고로 123',
    warehouseManagerName: '최고은',
    contact: '010-8888-9999',

    totalProductCount: 3,
    totalQuantity: 45,
    totalAmount: 565000,

    rejectReason: '',

    items: [
        {
            productCode: 'PROD-001',
            productName: '에티오피아 프리미엄 원두',
            unit: '1kg',
            contractPrice: 35000,
            minOrderQty: 10,
            quantity: 15,
            totalPrice: 350000
        },
        {
            productCode: 'PROD-002',
            productName: '유기농 우유',
            unit: '1L',
            contractPrice: 4500,
            minOrderQty: 20,
            quantity: 50,
            totalPrice: 90000
        },
        {
            productCode: 'PROD-003',
            productName: '수제 초콜릿 세트',
            unit: '세트',
            contractPrice: 25000,
            minOrderQty: 5,
            quantity: 10,
            totalPrice: 125000
        }
    ]
}
