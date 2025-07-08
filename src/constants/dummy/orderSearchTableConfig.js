export const searchTableConfigs = {
    vendor: {
        columns: [
            { key: 'name', label: '거래처명', align: 'left' },
            { key: 'type', label: '거래처 유형', align: 'center' },
            { key: 'address', label: '거래처 주소', align: 'left' },
            { key: 'status', label: '거래 상태', align: 'center' },
            { key: 'actions', label: '선택', align: 'center' }
        ],
        data: [
            { id: 1, name: '농심식자재', type: '식자재', address: '서울...', status: 'ACTIVE' },
            { id: 2, name: '서울식품', type: '유통', address: '서울 마포구 월드컵북로 77', status: 'EXPIRED' },
            { id: 3, name: '부산유통', type: '도매', address: '부산 해운대구 해운대로 20', status: 'ACTIVE' },
            { id: 4, name: '제주식자재', type: '식자재', address: '제주 제주시 신대로 55', status: 'ACTIVE' },
            { id: 5, name: '경기상사', type: '유통', address: '경기도 수원시 팔달구 99번길', status: 'EXPIRED' },
            { id: 6, name: '인천푸드', type: '도매', address: '인천 남동구 간석로 88', status: 'ACTIVE' },
            { id: 7, name: '대전종합물류', type: '종합', address: '대전 중구 중앙로 101', status: 'ACTIVE' }
        ],
        customSlots: ['status']
    },
    approver: {
        columns: [
            { key: 'name', label: '결재자 이름', align: 'left' },
            { key: 'position', label: '직위', align: 'center' },
            { key: 'email', label: '이메일', align: 'left' },
            { key: 'actions', label: '선택', align: 'center' }
        ],
        data: [
            { id: 1, name: '홍승인', position: '본부장', email: 'hong@...' },
            { id: 2, name: '이유정', position: '매니저', email: 'lee@corp.com' },
            { id: 3, name: '박태수', position: '과장', email: 'park@corp.com' },
            { id: 4, name: '김보라', position: '팀장', email: 'kim@corp.com' },
            { id: 5, name: '정지우', position: '대리', email: 'jeong@corp.com' },
            { id: 6, name: '오세민', position: '사원', email: 'oh@corp.com' },
            { id: 7, name: '최하늘', position: '차장', email: 'choi@corp.com' }
        ],
        customSlots: []
    },
    warehouse: {
        columns: [
            { key: 'name', label: '창고명', align: 'left' },
            { key: 'status', label: '창고 상태', align: 'center' },
            { key: 'address', label: '창고 주소', align: 'left' },
            { key: 'actions', label: '선택', align: 'center' }
        ],
        data: [
            { id: 1, name: '서울물류센터', status: 'ACTIVE', address: '서울...' },
            { id: 2, name: '부산창고', status: 'INACTIVE', address: '부산 사하구 낙동대로 345' },
            { id: 3, name: '대전허브센터', status: 'ACTIVE', address: '대전 유성구 대덕대로 77' },
            { id: 4, name: '경기물류단지', status: 'ACTIVE', address: '경기 화성시 동탄대로 12' },
            { id: 5, name: '제주보관소', status: 'EXPIRED', address: '제주 제주시 애월읍 평화로 52' },
            { id: 6, name: '인천창고', status: 'ACTIVE', address: '인천 연수구 청학동 33-2' },
            { id: 7, name: '광주센터', status: 'INACTIVE', address: '광주 북구 용봉로 151' }
        ],
        customSlots: ['status']
    },
    product: {
        columns: [
            { key: 'productCode', label: '제품 코드' },
            { key: 'productName', label: '제품명' },
            { key: 'unit', label: '단위' },
            { key: 'storeType', label: '보관 방식' },
            { key: 'unitPrice', label: '단가' },
            { key: 'actions', label: '' }
        ],
        data: [
            { id: 1, productCode: 'P001', productName: '고구마말랭이', unit: '봉지', storeType: '실온', unitPrice: 1200 },
            { id: 2, productCode: 'P002', productName: '냉동떡볶이', unit: '팩', storeType: '냉동', unitPrice: 3500 },
            { id: 3, productCode: 'P003', productName: '두유세트', unit: '박스', storeType: '상온', unitPrice: 7500 }
        ],
        customSlots: []
    }
}
