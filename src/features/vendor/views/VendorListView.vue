<template>
  <ListLayout
      title="거래처 목록 조회"
      description="모든 거래처 목록을 조회하고 관리할 수 있습니다."
  >
    <!-- 거래처 필터 -->
    <template #filters>
      <VendorFilters
          @apply="handleSearch"
          @reset="handleReset"
      />
    </template>

    <!-- 거래처 테이블 & 페이징 -->
    <template #table>
      <VendorTable
          :vendors="vendors"
          :page="page"
          :pageSize="PAGE_SIZE"
          @detail="goDetail"
      />
      <Pagination
          v-model="page"
          :total-items="totalCount"
          :items-per-page="PAGE_SIZE"
      />
    </template>
  </ListLayout>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import ListLayout from '@/components/layout/ListLayout.vue'
import Pagination from '@/components/common/Pagination.vue'
import VendorTable from '../components/VendorTable.vue'
import VendorFilters from '../components/VendorFilters.vue'
import { fetchVendors } from '@/features/vendor/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- 필터 상태 (백엔드 DTO와 일치하게 초기화) ---
const filters = reactive({
  vendorName: '',
  zipcode: '',
  addressRoad: '',
  addressDetail: '',
  vendorType: '',
  vendorStatus: '',
  vendorStartDate: '',
  vendorEndDate: '',
})

const vendors = ref([])
const totalCount = ref(0)
const page = ref(1)
const PAGE_SIZE = 10

watch(page, loadVendors)

const handleSearch = (newFilters) => {
  console.log('[handleSearch] newFilters:', newFilters)

  // filters.vendorName = newFilters.vendorName || ''
  // filters.vendorType = newFilters.vendorType || ''
  // filters.vendorStatus = newFilters.vendorStatus || ''
  // filters.vendorStartDate = newFilters.vendorDate?.start || ''
  // filters.vendorEndDate = newFilters.vendorDate?.end || ''
  //
  // console.log('[handleSearch] 최종 filters 상태:', filters)
  //
  // // 주소 필드를 하나로 명확하게 통일
  // filters.addressRoad = newFilters.vendorAddress || ''
  //
  // page.value = 1
  // loadVendors()
  filters.vendorName = newFilters.vendorName || ''
  filters.vendorType = newFilters.vendorType || ''
  filters.vendorStatus = newFilters.vendorStatus || ''
  filters.vendorStartDate = newFilters.vendorStartDate || ''
  filters.vendorEndDate = newFilters.vendorEndDate || ''

  console.log('[handleSearch] 최종 filters 상태:', filters)

  filters.zipcode = newFilters.zipcode || ''
  filters.addressRoad = newFilters.addressRoad || ''
  filters.addressDetail = newFilters.addressDetail || ''

  page.value = 1
  loadVendors()
}

const handleReset = () => {
  Object.assign(filters, {
    vendorName: '',
    zipcode: '',
    addressRoad: '',
    addressDetail: '',
    vendorType: '',
    vendorStatus: '',
    vendorStartDate: '',
    vendorEndDate: '',
  })
  page.value = 1
  loadVendors()
}

async function loadVendors() {
  const params = {
    page: page.value - 1,
    size: PAGE_SIZE,
    sort: 'vendorName,desc',
    ...filters
  }

  // 빈 값 제거
  Object.keys(params).forEach(key => {
    if (!params[key]) delete params[key]
  })

  console.log('[loadVendors] 최종 API 파라미터:', params)

  const res = await fetchVendors(params)
  const data = res.data.data

  console.log('[loadVendors] API 응답:', data)

  vendors.value = data.contents || []
  totalCount.value = data.totalElements || 0
}

const goDetail = (item) => {
  router.push(`/vendor/${item.vendorId}`)
}

const goToCreatePage = () => {
  router.push('/vendor/register')
}

onMounted(loadVendors)
</script>
