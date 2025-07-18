<script setup>
import { ref, onMounted } from 'vue'
import TakeBackList from '@/features/takeback/components/TakeBackList.vue'
import TakeBackFilter from '@/features/takeback/components/TakeBackFilter.vue'

import ListFiltersSection from '@/components/layout/listview/ListFiltersSection.vue'
import ListTopActions from '@/components/layout/listview/ListTopActions.vue'
import ListTableSection from '@/components/layout/listview/ListTableSection.vue'
import Pagination from '@/components/common/Pagination.vue'

const filters = ref({
  orderNumber: '',
  productName: '',
  franchiseName: '',
  takeBackStatus: '',
  fromDate: '',
  toDate: ''
})

const page = ref(1)
const size = ref(10)
const total = ref(0)
const lastFilters = ref({})

const onSearch = (newFilters) => {
  filters.value = { ...newFilters }
  lastFilters.value = { ...newFilters }
  page.value = 1
}

const onPageChange = (newPage) => {
  page.value = newPage
}
</script>

<template>
  <main>
    <!-- 페이지 헤더 -->
    <section class="page-header">
      <h1 class="page-title">반품 조회</h1>
      <p class="page-description">반품 요청 내역을 확인할 수 있습니다.</p>
    </section>

    <!-- 검색 필터 -->
    <ListFiltersSection>
      <TakeBackFilter @search="onSearch" />
    </ListFiltersSection>

    <!-- 상단 액션 (필요 시 버튼 배치 가능) -->
    <ListTopActions>
      <template #left />
      <template #right />
    </ListTopActions>

    <!-- 테이블 -->
    <ListTableSection>
      <TakeBackList
          :filters="filters"
          :page="page - 1"
          :size="size"
          @update:totalElements="total = $event"
      />
    </ListTableSection>

    <!-- 페이지네이션 -->
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
