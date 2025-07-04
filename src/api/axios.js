import axios from 'axios'

// 기본 axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080', // 더미용 -> 추후 env로 관리
    headers : { 'Content-Type' : 'application/json' },
    withCredentials : true
})

export default api