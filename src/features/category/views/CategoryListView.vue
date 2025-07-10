<template>
  <ListLayout
      title="카테고리 목록"
      description="모든 카테고리 목록을 조회하고 관리할 수 있습니다."
  >
    <!-- filters -->
    <template #filters>
      <CategoryFilters
          v-if="mergedCategories.length > 0"
          :top-categories="topCategoryOptions"
          @apply="handleSearch"
      />
    </template>

    <!-- top-actions -->
    <template #top-actions-right>
      <CreateButton @click="openCreateModal">카테고리 추가</CreateButton>
    </template>

    <!-- table -->
    <template #table>
      <SkeletonList v-if="isLoading" :rows="8" :columns="6" :cellWidth="120" />
      <EmptyResult
          v-else-if="!isLoading && pagedTableRows.length === 0"
          message="등록된 카테고리가 없습니다."
      />
      <template v-else>
        <CategoryTable
            :categories="pagedTableRows"
            @edit="openEditModal"
            @delete="openDeleteModal"
        />
        <Pagination
            v-model="page"
            :total-items="totalTopCount"
            :items-per-page="PAGE_SIZE"
            @update:modelValue="handlePageChange"
        />
      </template>
    </template>

  </ListLayout>

  <!-- 등록/수정 모달 -->
  <CategoryModal
      v-if="showModal"
      :is-top="editType === 'TOP'"
      :top-edit-data="editType === 'TOP' ? editTarget : null"
      :category-edit-data="editType === 'SUB' ? editTarget : null"
      :top-categories="topCategoryOptions"
      @close="closeModal"
      @refresh="refreshList"
  />

  <!-- 삭제 확인 모달 -->
  <CategoryDeleteConfirmModal
      v-if="deleteTarget"
      :target-id="deleteTarget.id"
      :is-top="deleteTarget.isTop"
      @close="deleteTarget = null"
      @deleted="refreshList"
  />

  <SelectCategoryTypeModal
      v-if="showSelectModal"
      @select="handleTypeSelected"
      @close="showSelectModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  fetchAllListTopCategories,
  fetchCategories
} from '@/features/category/api.js'

import ListLayout from '@/components/layout/ListLayout.vue'
import EmptyResult from "@/components/common/EmptyResult.vue";
import Pagination from '@/components/common/Pagination.vue'
import SkeletonList from "@/components/common/SkeletonList.vue";
import CreateButton from '@/components/common/top-actions/CreateButton.vue'
import CategoryFilters from '../components/CategoryFilters.vue'
import CategoryTable from '../components/CategoryTable.vue'
import CategoryModal from '../components/CategoryModal.vue'
import CategoryDeleteConfirmModal from '../components/CategoryDeleteConfirmModal.vue'
//import SelectCategoryTypeModal from '../components/SelectCategoryTypeModal.vue'

// 1. 원본 상태(항상 그대로 보관!)
const mergedCategories = ref([])     // [{topCategoryId, topCategoryName, createdAt, modifiedAt, categories:[...]}]
const isLoading = ref(true)
const page = ref(1)
const PAGE_SIZE = 5

// 2. 필터(검색) 조건만 별도 상태로 관리
const filterCondition = ref({})

// 모달/액션 관련
const showModal = ref(false)
const showSelectModal = ref(false)
const editType = ref('SUB')
const editTarget = ref(null)
const deleteTarget = ref(null)

// 3. 데이터 머지 & 상태 세팅 함수
const loadAndMergeCategories = async () => {
    isLoading.value = true
    try {
        const [resAllTop, resWithSub] = await Promise.all([
            fetchAllListTopCategories(),
            fetchCategories({ page: 1, size: 100 })
        ]);
        const allTop = resAllTop.data?.data ?? [];
        const topWithSub = resWithSub.data?.data?.topCategories ?? [];
        // 머지!
        mergedCategories.value = allTop.map(top => {
            const found = topWithSub.find(t => t.topCategoryId === top.topCategoryId);
            return {
                ...top,
                categories: found?.categories ?? []
            }
        });
    } finally {
        isLoading.value = false
    }
}

// 4. 필터용 드롭다운 (항상 원본 기준)
const topCategoryOptions = computed(() =>
        mergedCategories.value.map(item => ({
            label: item.topCategoryName,
            value: item.topCategoryId,
            categories: item.categories
        }))
)

// 5. 화면에 보여줄 데이터는 filterCondition, 페이징까지 모두 computed!
const filteredCategories = computed(() => {
    let list = mergedCategories.value;
    const filters = filterCondition.value;
    if (filters.topCategoryId) {
        list = list.filter(t => t.topCategoryId === filters.topCategoryId);
    }
    if (filters.categoryId) {
        list = list.map(t => ({
            ...t,
            categories: t.categories.filter(c => c.categoryId === filters.categoryId)
        })).filter(t => t.categories.length > 0);
    }
    return list;
});
const totalTopCount = computed(() => filteredCategories.value.length);

const pagedTopCategories = computed(() => {
    const startIdx = (page.value - 1) * PAGE_SIZE;
    return filteredCategories.value.slice(startIdx, startIdx + PAGE_SIZE);
});

const pagedTableRows = computed(() =>
        pagedTopCategories.value.flatMap((top, idx) => {
            const rows = [];
            rows.push({
                no: (page.value - 1) * PAGE_SIZE + idx + 1,
                isSummary: true,
                topCategoryId: top.topCategoryId,
                topCategoryName: top.topCategoryName,
                productCount: top.categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
                createdAt: top.createdAt,
                modifiedAt: top.modifiedAt,
                categoryId: null,
                categoryName: '-',
            });
            if (top.categories.length > 0) {
                rows.push(
                        ...top.categories.map(cat => ({
                            no: '',
                            isSummary: false,
                            topCategoryId: top.topCategoryId,
                            topCategoryName: top.topCategoryName,
                            categoryId: cat.categoryId,
                            categoryName: cat.categoryName,
                            categoryCode: cat.categoryCode,
                            productCount: cat.productCount,
                            createdAt: cat.createdAt,
                            modifiedAt: cat.modifiedAt
                        }))
                );
            }
            return rows;
        })
);

// 6. 검색(필터)시, 조건만 변경! (데이터 불변)
const handleSearch = (filters) => {
    console.log('[검색] 필터 조건:', filters);
    const normalized = { ...filters };
    if (normalized.topCategoryId) normalized.topCategoryId = Number(normalized.topCategoryId);
    if (normalized.categoryId) normalized.categoryId = Number(normalized.categoryId);
    filterCondition.value = normalized;
    page.value = 1;
}
const handlePageChange = newPage => { page.value = newPage; }
const refreshList = async () => {
    await loadAndMergeCategories();
    page.value = 1;
    filterCondition.value = {};
}

// 모달 등은 동일하게 유지
const openCreateModal = () => {
    showSelectModal.value = true
    editType.value = 'SUB'
    editTarget.value = null
}
const handleTypeSelected = (type) => {
    editType.value = type
    editTarget.value = null
    showSelectModal.value = false
    showModal.value = true
}
const openEditModal = (item, type = 'SUB') => {
    showModal.value = true
    editType.value = type
    editTarget.value = item
}
const closeModal = () => {
    showModal.value = false
    editTarget.value = null
}
const openDeleteModal = (item) => {
    deleteTarget.value = {
        id: item.categoryId || item.topCategoryId,
        isTop: !!item.topCategoryId && !item.categoryId
    }
}

onMounted(() => {
    loadAndMergeCategories()
})

</script>
