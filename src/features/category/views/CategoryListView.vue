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
          @reset="handleReset"
      />
    </template>

    <!-- top-actions -->
    <template v-if="isManager" #top-actions-right>
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

  <CategoryModal
      v-if="showModal"
      :is-top="editType === 'TOP'"
      :top-edit-data="editType === 'TOP' ? editTarget : null"
      :category-edit-data="editType === 'SUB' ? editTarget : null"
      :top-categories="topCategoryOptions"
      @close="closeModal"
      @refresh="opts => refreshList(opts)"
  />

  <CategoryDoneModal
      v-if="doneModal.show"
      :type="doneModal.type"
      :is-top="doneModal.isTop"
      @close="doneModal.show = false"
  />

  <CategoryDeleteConfirmModal
      v-if="deleteTarget"
      :target-id="deleteTarget.id"
      :is-top="deleteTarget.isTop"
      @close="deleteTarget = null"
      @confirm="handleDelete"
  />

  <CategoryErrorModal
      v-if="ErrorOpen"
      :message="ErrorMsg"
      @close="ErrorOpen = false"
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
  fetchCategories,
  deleteTopCategory,
  deleteCategory
} from '@/features/category/api.js'

import ListLayout from '@/components/layout/ListLayout.vue'
import EmptyResult from '@/components/common/EmptyResult.vue'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonList from '@/components/common/SkeletonList.vue'
import CreateButton from '@/components/common/top-actions/CreateButton.vue'
import CategoryFilters from '../components/CategoryFilters.vue'
import CategoryTable from '../components/CategoryTable.vue'
import CategoryModal from '../components/CategoryModal.vue'
import CategoryDeleteConfirmModal from '../components/CategoryDeleteConfirmModal.vue'
import SelectCategoryTypeModal from '../components/SelectCategoryTypeModal.vue'
import CategoryDoneModal from '@/features/category/components/CategoryDoneModal.vue'
import CategoryErrorModal from '@/features/category/components/CategoryErrorModal.vue'
import {useAuthStore} from "@/features/auth/useAuthStore.js";

const mergedCategories = ref([])
const isLoading = ref(true)
const page = ref(1)
const PAGE_SIZE = 5
const filterCondition = ref({})

const showModal = ref(false)
const showSelectModal = ref(false)
const editType = ref('SUB')
const editTarget = ref(null)
const deleteTarget = ref(null)

const doneModal = ref({
  show: false,
  type: 'edit',
  isTop: false
})

const authStore = useAuthStore()
const authority = authStore.authority

const isGeneralManager = computed(() => authority === 'GENERAL_MANAGER')
const isSeniorManager = computed(() => authority === 'SENIOR_MANAGER')
const isSuperAdmin = computed(() => authority === 'SUPER_ADMIN')

const isManager = computed(() =>
    isGeneralManager.value || isSeniorManager.value || isSuperAdmin.value
)

const ErrorOpen = ref(false)
const ErrorMsg = ref('')
const showError = (msg) => {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

const showErrorFromResponse = (e) => {
  const code = e?.response?.data?.code;
  const message = e?.response?.data?.message;

  switch (code) {
    case '20002':
      showError('하위 카테고리가 있어 상위 카테고리를 삭제할 수 없습니다.');
      break;
    case '21002':
      showError('카테고리에 연결된 제품이 있어 삭제할 수 없습니다.');
      break;
    case '20001':
    case '21001':
      showError('이미 존재하는 이름입니다.');
      break;
    default:
      showError(message || '오류가 발생했습니다.');
  }
};

const loadAndMergeCategories = async () => {
  isLoading.value = true
  try {
    const [resAllTop, resWithSub] = await Promise.all([
      fetchAllListTopCategories(),
      fetchCategories({ page: 1, size: 100 })
    ])
    const allTop = resAllTop.data?.data ?? []
    const topWithSub = resWithSub.data?.data?.topCategories ?? []
    mergedCategories.value = allTop.map(top => {
      const found = topWithSub.find(t => t.topCategoryId === top.topCategoryId)
      return {
        ...top,
        categories: found?.categories ?? []
      }
    })
  } finally {
    isLoading.value = false
  }
}

const topCategoryOptions = computed(() =>
    mergedCategories.value.map(item => ({
      label: item.topCategoryName,
      value: item.topCategoryId,
      categories: item.categories
    }))
)

const filteredCategories = computed(() => {
  let list = mergedCategories.value
  const filters = filterCondition.value
  if (filters.topCategoryId) {
    list = list.filter(t => t.topCategoryId === filters.topCategoryId)
  }
  if (filters.categoryId) {
    list = list.map(t => ({
      ...t,
      categories: t.categories.filter(c => c.categoryId === filters.categoryId)
    })).filter(t => t.categories.length > 0)
  }
  return list
})

const totalTopCount = computed(() => filteredCategories.value.length)

const pagedTopCategories = computed(() => {
  const startIdx = (page.value - 1) * PAGE_SIZE
  return filteredCategories.value.slice(startIdx, startIdx + PAGE_SIZE)
})

const pagedTableRows = computed(() =>
    pagedTopCategories.value.flatMap((top, idx) => {
      const rows = []
      rows.push({
        no: (page.value - 1) * PAGE_SIZE + idx + 1,
        isSummary: true,
        topCategoryId: top.topCategoryId,
        topCategoryName: top.topCategoryName,
        productCount: top.categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
        createdAt: top.createdAt,
        modifiedAt: top.modifiedAt,
        categoryId: null,
        categoryName: '-'
      })
      if (top.categories.length > 0) {
        rows.push(...top.categories.map(cat => ({
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
        })))
      }
      return rows
    })
)

const handleSearch = (filters) => {
  const normalized = { ...filters }
  if (normalized.topCategoryId) normalized.topCategoryId = Number(normalized.topCategoryId)
  if (normalized.categoryId) normalized.categoryId = Number(normalized.categoryId)
  filterCondition.value = normalized
  page.value = 1
}

const handleReset = () => {
  filterCondition.value = {}
  page.value = 1
}

const handlePageChange = (newPage) => {
  page.value = newPage
}

const refreshList = async (opts = {}) => {
  await loadAndMergeCategories()
  page.value = 1
  filterCondition.value = {}
  if (opts && opts.showDone) {
    doneModal.value = {
      show: true,
      type: opts.type ?? 'edit',
      isTop: opts.isTop ?? false
    }
  }
}

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

const handleDelete = async () => {
    if (!deleteTarget.value) return

    const { id, isTop } = deleteTarget.value

  try {
    if (isTop) {
      await deleteTopCategory(id)
    } else {
      await deleteCategory(id)
    }

    deleteTarget.value = null
    doneModal.value = {
      show: true,
      type: 'delete',
      isTop
    }
    await refreshList()
  } catch (e) {
    deleteTarget.value = null
    showErrorFromResponse(e, isTop)
  }
}

onMounted(() => {
  loadAndMergeCategories()
})
</script>