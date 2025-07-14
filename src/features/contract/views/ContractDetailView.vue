<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { fetchContractDetail } from '@/features/contract/api.js'
import ContractForm from '../components/ContractForm.vue'

const route = useRoute()
const contractId = route.params.contractId

const contract = ref({})
const isLoading = ref(true)

async function loadDetail() {
  isLoading.value = true
  const res = await fetchContractDetail(contractId)
  contract.value = res.data.data
  isLoading.value = false
}

onMounted(loadDetail)

</script>

<template>
  <div v-if="isLoading">로딩중...</div>
  <ContractForm v-else :contract="contract" @refresh="loadDetail" />
</template>
