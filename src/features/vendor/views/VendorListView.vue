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

    <!-- 상단 우측 버튼 -->
    <template #top-actions-right>
      <CreateButton @click="goToCreatePage">거래처 추가</CreateButton>
    </template>

    <!-- 거래처 테이블 & 페이징 -->
    <template #table>
      <VendorTable
          :vendors="pagedVendors"
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import ListLayout from '@/components/layout/ListLayout.vue'
import Pagination from '@/components/common/Pagination.vue'
import CreateButton from "@/components/common/top-actions/CreateButton.vue";
import VendorTable from '../components/VendorTable.vue'
import VendorFilters from '../components/VendorFilters.vue'
import { fetchVendors } from '@/features/vendor/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- 필터/상태 ---
// 실제 백엔드 파라미터명과 맞추세요
const filters = reactive({
  vendorName: '',
  addressRoad: '',
  vendorType: '',
  vendorStatus: '',
  vendorDate: '',
})

const vendors = ref([])
const totalCount = ref(0)
const page = ref(1)
const PAGE_SIZE = 10

const pagedVendors = computed(() => vendors.value)

// page 값이 변할 때 자동으로 재조회 (Pagination에 반응)
watch(page, () => {
  loadVendors()
})

// 검색/리셋 할 때 항상 1페이지부터
const handleSearch = (newFilters) => {
  Object.assign(filters, newFilters)
  page.value = 1
  loadVendors()
}
const handleReset = () => {
  Object.keys(filters).forEach(k => filters[k] = '')
  page.value = 1
  loadVendors()
}

const loadVendors = async () => {
  const params = {
    ...filters,
    page: page.value,
    size: PAGE_SIZE
  }
  Object.keys(params).forEach(k => {
    if (params[k] === '' || params[k] == null) delete params[k]
  })
  console.log('API params:', params)
  const res = await fetchVendors(params)
  const d = res.data.data
  vendors.value = d.contents ?? []
  totalCount.value = d.totalElements ?? 0
}

// const loadVendors = async () => {
//   const params = {
//     ...filters,
//     page: page.value,
//     size: PAGE_SIZE
//   }
//   // 빈 값 파라미터 제거
//   Object.keys(params).forEach(k => {
//     if (params[k] === '' || params[k] == null) delete params[k]
//   })
//   const res = await fetchVendors(params)
//   const d = res.data.data
//   // 다양한 응답 형태에 대응
//   vendors.value = d.contents ?? []
//   totalCount.value = d.totalElements ?? 0
// }

// 상세 페이지 이동
const goDetail = (item) => {
  router.push(`/vendor/${item.vendorId}`)
}

// 추가(등록) 페이지 이동
const goToCreatePage = () => {
  router.push('/vendor/register')
}

// 최초 로딩 (page, filter가 바뀌어도 중복 호출되지 않음)
onMounted(() => {
  loadVendors()
})
</script>
