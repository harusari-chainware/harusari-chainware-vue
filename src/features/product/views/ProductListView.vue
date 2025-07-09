<template>
  <ListLayout
      title="제품 목록 조회"
      description="모든 제품 목록을 조회하고 관리할 수 있습니다."
  >
    <template #filters>
      <ProductFilters
          :top-categories="topCategories"
          @apply="handleSearch"
          @reset="handleReset"
      />
    </template>

    <template #top-actions-right>
      <CreateButton @click="openModal">파일 출력</CreateButton>
      <CreateButton @click="goToCreatePage">제품 추가</CreateButton>
    </template>

    <template #table>

      <ProductTable
          :products="pagedProducts"
          :categories="topCategories"
          @detail="goDetail"
      />
      <Pagination
          v-model="page"
          :total-items="totalCount"
          :items-per-page="PAGE_SIZE"
          @update:modelValue="loadProducts"
      />
    </template>
  </ListLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import ListLayout from '@/components/layout/ListLayout.vue'
import Pagination from '@/components/common/Pagination.vue'
import { fetchAllListTopCategories, fetchAllTopCategories  } from '@/api/categoryApi'
import { fetchProducts } from '@/api/productApi'
import CreateButton from "@/components/common/top-actions/CreateButton.vue";
import ProductTable from '../components/ProductTable.vue'
import ProductFilters from '../components/ProductFilters.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCreatePage = () => {
  router.push('/product/register')
}

const openModal = () => {
  alert('파일 출력 기능 준비 중!');
}

// --- 필터/상태 ---
const filters = reactive({
  topCategoryId: '',
  categoryId: '',
  storeType: '',
  productStatus: '',
  productName: '',
  createdAt: ''
})

// --- 카테고리 데이터 ---
const topCategories = ref([]) // 전체(상위+하위) 카테고리(카테고리 드롭다운에 사용)
const topCategoryListOnly = ref([]) // 상위만 (상위 카테고리 드롭다운 전용)
const topCategoryOptions = ref([{ label: '전체', value: '' }])
const categoryOptions = ref([{ label: '전체', value: '' }])

onMounted(async () => {
  // 1. 상위 카테고리(이름/ID만)
  const resTop = await fetchAllListTopCategories()
  topCategoryListOnly.value = resTop.data.data.topCategories ?? []
  topCategoryOptions.value = [
    ...topCategoryListOnly.value.map(tc => ({
      label: tc.topCategoryName,
      value: String(tc.topCategoryId)
    }))
  ]
  // 2. 전체 카테고리(하위까지)
  const resFull = await fetchAllTopCategories()
  topCategories.value = resFull.data.data.topCategories ?? []
})

watch(() => filters.topCategoryId, newTopId => {
  filters.categoryId = ''
  const found = topCategories.value.find(tc => String(tc.topCategoryId) === String(newTopId))
  if (found && found.categories && found.categories.length > 0) {
    categoryOptions.value = [
      ...found.categories.map(cat => ({
        label: cat.categoryName,
        value: String(cat.categoryId)
      }))
    ]
  } else {
    categoryOptions.value = [{ label: '전체', value: '' }]
  }
}, { immediate: true })

// --- 제품 목록/페이징 ---
const products = ref([])
const totalCount = ref(0)
const page = ref(1)
const PAGE_SIZE = 10

const pagedProducts = computed(() => products.value)

const loadProducts = async () => {
  console.log('[loadProducts] filters:', filters)
  const params = {
    ...filters,
    page: page.value,
    size: PAGE_SIZE
  }
  console.log('[loadProducts] params:', params)
  Object.keys(params).forEach(k => {
    if (params[k] === '' || params[k] == null) delete params[k]
  })
  const res = await fetchProducts(params)
  products.value = res.data.data.products
  totalCount.value = res.data.data.pagination.totalItems
}

// --- 필터/검색/초기화 ---
// const handleSearch = () => {
//   page.value = 1
//   loadProducts()
// }



// const handleReset = () => {
//   Object.assign(filters, {
//     topCategoryId: '',
//     categoryId: '',
//     storeType: '',
//     productStatus: '',
//     productName: '',
//     createdAt: ''
//   })
//   page.value = 1
//   loadProducts()
// }

const handleSearch = (newFilters) => {
  console.log('[handleSearch] 전달된 값:', newFilters)
  Object.assign(filters, newFilters) // 부모 filters reactive에 반영!
  page.value = 1
  loadProducts()
}
const handleReset = () => {
  Object.assign(filters, {
    topCategoryId: '',
    categoryId: '',
    storeType: '',
    productStatus: '',
    productName: '',
    createdAt: ''
  })
  page.value = 1
  loadProducts()
}


// --- 상세/추가 (라우터 연결 등) ---
const goDetail = (item) => {
  router.push(`/product/${item.productId}`)
}

const goAddProduct = () => { /* 추가 페이지로 이동 */ }

// 최초 로딩
onMounted(() => {
  loadProducts()
})
</script>

