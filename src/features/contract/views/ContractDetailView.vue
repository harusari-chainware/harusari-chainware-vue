<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { fetchContractDetail } from '@/features/contract/api.js'
import ContractForm from '../components/ContractForm.vue'

const route = useRoute()
const contractId = route.params.contractId

const contract = ref({})
const isLoading = ref(true)

onMounted(async () => {
  const res = await fetchContractDetail(contractId)
  contract.value = res.data.data
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">로딩중...</div>
  <ContractForm v-else :contract="contract" />
</template>
