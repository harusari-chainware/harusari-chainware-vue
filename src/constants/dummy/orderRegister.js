export const dummyOrderRegister = {
    orderType: '주문',
    store: {
        name: '강남 1호점',
        phone: '02-987-6543',
        owner: '김점주',
        ownerPhone: '010-1234-5678'
    },
    approver: {
        id: null,
        name: '홍승인',
        role: '본부장'
    },
    vendor: {
        id: null,
        name: '농심식자재',
        phone: ''
    },
    warehouse: {
        id: null,
        name: '서울물류센터',
        location: ''
    },
    deliveryDate: '2025-08-01',
    orderCategory: '공급업체',
    memo: '오전 납품 요청',
    address: '서울시 강남구 테헤란로 123',
    attachments: [],
    items: [
        {
            productCode: 'P-001',
            productName: '진라면 순한맛 20입',
            unit: 'BOX',
            storeType: '실온',
            unitPrice: 8900,
            quantity: 2,
            totalPrice: 17800
        },
        {
            productCode: 'P-002',
            productName: '신라면 20입',
            unit: 'BOX',
            storeType: '실온',
            unitPrice: 9600,
            quantity: 3,
            totalPrice: 28800
        }
    ]
}
