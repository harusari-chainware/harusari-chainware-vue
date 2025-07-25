<template>
  <ListLayout
      title="거래처 별 제품 계약 목록 조회"
      description="거래처 별 제품 계약 정보를 조회할 수 있습니다."
  >
    <!-- 필터 영역 -->
    <template #filters>
      <ContractFilters
          :top-categories="topCategories"
          :vendor-type-options="vendorTypeOptions"
          :contract-status-options="contractStatusOptions"
          @apply="handleSearch"
      />
    </template>

    <template v-if="isManager" #top-actions-right>
<!--      <CreateButton @click="openModal">파일 출력</CreateButton>-->
      <CreateButton @click="goToCreatePage">계약 추가</CreateButton>
    </template>

    <!-- 테이블 영역 -->
    <template #table>
      <ContractTable
          :contracts="contracts"
          :total-count="totalCount"
          :page="page"
          :page-size="PAGE_SIZE"
      />

<!--    <template #table>-->
<!--      <ContractTable-->
<!--          :contracts="contracts"-->
<!--          :products="pagedProducts"-->
<!--          :categories="topCategories"-->
<!--          @detail="goDetail"-->
<!--      />-->

      <Pagination
          v-model="page"
          :total-items="totalCount"
          :items-per-page="PAGE_SIZE"
          @update:modelValue="loadContracts"
      />
    </template>
  </ListLayout>
</template>

<script setup>
import {ref, reactive, onMounted, computed} from 'vue'
import ListLayout from '@/components/layout/ListLayout.vue'
import Pagination from '@/components/common/Pagination.vue'
import ContractFilters from '../components/ContractFilters.vue'
import ContractTable from '../components/ContractTable.vue'
import { fetchAllListTopCategories } from '@/features/category/api.js'
import { fetchContracts } from '@/features/contract/api.js'
import CreateButton from "@/components/common/top-actions/CreateButton.vue";
import { useRouter } from 'vue-router'
import {useAuthStore} from "@/features/auth/useAuthStore.js";

const router = useRouter()

const authStore = useAuthStore()
const authority = authStore.authority

const goToCreatePage = () => {
  router.push('/contract/register')
}

// const openModal = () => {
//   alert('파일 출력 기능 준비 중!');
// }

const contracts = ref([])
const totalCount = ref(0)
const page = ref(1)
const PAGE_SIZE = 10

// 옵션 데이터 (카테고리, 거래처유형, 계약상태 등)
const topCategories = ref([])
const vendorTypeOptions = [
  { label: '공급업체', value: 'SUPPLIER' },
  { label: '위탁업체', value: 'TRUST_CONTRACTOR' },
  { label: '물류', value: 'LOGISTICS' },
  { label: '대행업체', value: 'AGENCY' }
]
const contractStatusOptions = [
  { label: '계약 중', value: 'ACTIVE' },
  { label: '계약 만료', value: 'EXPIRED' }
]

// 필터 reactive (API 파라미터 매핑)
const filters = reactive({
  productName: '',
  vendorName: '',
  contractDate: '', // 지정 날짜에 계약 중인 계약 모두
  categoryName: '',
  topCategoryName: '',
  contractStatus: '',
  vendorType: ''
})

const isGeneralManager = computed(() => authority === 'GENERAL_MANAGER')
const isSeniorManager = computed(() => authority === 'SENIOR_MANAGER')
const isSuperAdmin = computed(() => authority === 'SUPER_ADMIN')

const isManager = computed(() =>
    isGeneralManager.value || isSeniorManager.value || isSuperAdmin.value
)

const loadContracts = async () => {
  const params = {
    ...filters,
    page: page.value,
    size: PAGE_SIZE
  }
  // 비어있는 파라미터 삭제
  Object.keys(params).forEach(k => {
    if (params[k] === '' || params[k] == null) delete params[k]
  })
  const res = await fetchContracts(params)
  contracts.value = res.data.data.content
  totalCount.value = res.data.data.pagination.totalElements
}

const handleSearch = (newFilters) => {
  Object.assign(filters, newFilters)
  page.value = 1
  loadContracts()
}
const handleReset = () => {
  Object.keys(filters).forEach(k => filters[k] = '')
  page.value = 1
  loadContracts()
}

const goDetail = (item) => {
  router.push(`/contract/${item.contractId}`)
}

onMounted(async () => {
  const resTop = await fetchAllListTopCategories()
  topCategories.value = resTop.data.data.topCategories ?? []
  await loadContracts()
})
</script>
