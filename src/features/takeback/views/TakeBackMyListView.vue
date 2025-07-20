<!-- src/features/takeback/views/TakeBackMyListView.vue -->
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { fetchMyWarehouseId } from '@/features/takeback/api.js'
import TakeBackFilterMy from '@/features/takeback/components/TakeBackFilterMy.vue'
import TakeBackMyList from '@/features/takeback/components/TakeBackMyList.vue'
import Pagination from '@/components/common/Pagination.vue'
import ListFiltersSection from '@/components/layout/listview/ListFiltersSection.vue'
import ListTableSection from '@/components/layout/listview/ListTableSection.vue'

const warehouseId = ref(null)

const filters = reactive({
  franchiseName: '',
  takeBackStatus: '',
  fromDate: '',
  toDate: ''
})

const page = ref(1)
const size = ref(10)
const total = ref(0)
const reloadSignal = ref(0)

const onSearch = (newFilters) => {
  Object.assign(filters, newFilters)
  page.value = 1
  reloadSignal.value++
}

const onPageChange = (newPage) => {
  page.value = newPage
}

onMounted(async () => {
  try {
    const { data } = await fetchMyWarehouseId()
    //console.log('📦 fetchMyWarehouseId 응답:', data)
    warehouseId.value = data.data // ✅ 여기 수정
    //console.log('🚛 내 창고 ID:', warehouseId.value)
  } catch (e) {
   // console.error('📛 창고 ID 못 가져옴:', e)
  }
})
</script>

<template>
  <main v-if="warehouseId">
    <section class="page-header">
      <h1 class="page-title">내 창고 반품 조회</h1>
      <p class="page-description">내 창고로 들어온 반품 요청을 조회합니다.</p>
    </section>

    <ListFiltersSection>
      <TakeBackFilterMy @search="onSearch" />
    </ListFiltersSection>

    <ListTableSection>
      <TakeBackMyList
          :warehouse-id="warehouseId"
          :franchise-name="filters.franchiseName"
          :take-back-status="filters.takeBackStatus"
          :from-date="filters.fromDate"
          :to-date="filters.toDate"
          :page="page - 1"
          :size="size"
          :reload-signal="reloadSignal"
          @update:totalElements="total = $event"
      />
    </ListTableSection>

    <Pagination
        v-model="page"
        :total-items="total"
        :items-per-page="size"
        @update:modelValue="onPageChange"
    />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  overflow-y: auto;
}
.page-header {
  margin-bottom: 1rem;
}
.page-title {
  font-size: 1.5rem;
  color: var(--color-gray-900);
  margin-bottom: 6px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
}
.page-description {
  color: var(--color-gray-600);
  font-size: 0.875rem;
}
</style>
