<script setup>
import { reactive, ref } from 'vue'
import TakeBackList from '@/features/takeback/components/TakeBackList.vue'
import TakeBackFilter from '@/features/takeback/components/TakeBackFilter.vue'
import ListFiltersSection from '@/components/layout/listview/ListFiltersSection.vue'
import ListTopActions from '@/components/layout/listview/ListTopActions.vue'
import ListTableSection from '@/components/layout/listview/ListTableSection.vue'
import Pagination from '@/components/common/Pagination.vue'

// ✅ 누락된 warehouseName 포함!
const filters = reactive({
  orderNumber: '',
  productName: '',
  franchiseName: '',
  warehouseName: '',  // ✅ 추가
  takeBackStatus: '',
  fromDate: '',
  toDate: ''
})

const page = ref(1)
const size = ref(10)
const total = ref(0)

const reloadSignal = ref(false)

const onSearch = (newFilters) => {
  Object.assign(filters, {
    orderNumber: newFilters.orderNumber ?? '',
    productName: newFilters.productName ?? '',
    franchiseName: newFilters.franchiseName ?? '',
    warehouseName: newFilters.warehouseName ?? '',
    takeBackStatus: newFilters.takeBackStatus ?? '',
    fromDate: newFilters.fromDate ?? '',
    toDate: newFilters.toDate ?? ''
  })
  page.value = 1
  reloadSignal.value++
}

const onPageChange = (newPage) => {
  page.value = newPage
}
</script>

<template>
  <main>
    <section class="page-header">
      <h1 class="page-title">반품 조회</h1>
      <p class="page-description">반품 요청 내역을 확인할 수 있습니다.</p>
    </section>

    <ListFiltersSection>
      <TakeBackFilter @search="onSearch" />
    </ListFiltersSection>

    <ListTopActions>
      <template #left />
      <template #right />
    </ListTopActions>

    <ListTableSection>
      <TakeBackList
          :order-number="filters.orderNumber"
          :product-name="filters.productName"
          :franchise-name="filters.franchiseName"
          :warehouse-name="filters.warehouseName"
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
