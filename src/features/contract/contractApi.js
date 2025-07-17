import api from '@/api/axios.js'

export const getContractProductsByVendor = (params) => {
    return api.get("/contracts", {params})
}