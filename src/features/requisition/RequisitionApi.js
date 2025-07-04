import api from '@/api/axios.js'

/* 컨텍스트 별로 각각 백엔드와 연결되는 api*/
export function firstDummyAPI(memberId) {
    return api.get(`/firstDummy/${memberId}`);
}

export function secondDummyAPI(memberId) {
    return api.get(`/secondDummy/${memberId}`);
}