<template>
  <DetailLayout
      title="상위 카테고리 상세 조회"
      description="상위 카테고리와 연결된 카테고리를 확인할 수 있습니다."
  >
    <template #actions>
      <StatusButton type="primary" v-if="!isEditing" @click="isEditing = true">수정</StatusButton>
      <StatusButton type="primary" v-else @click="saveEdit">저장</StatusButton>
      <StatusButton type="danger" @click="handleDelete">삭제</StatusButton>
    </template>

    <template #basic>
      <div class="info-group">
        <div class="info-row">
          <label>상위 카테고리</label>
          <input type="text" v-model="detail.topCategoryName" :readonly="!isEditing" />
        </div>
        <div class="info-row">
          <label>총 제품 개수</label>
          <input type="text" :value="detail.productCount" disabled />
        </div>
        <div class="info-row">
          <label>등록 일시</label>
          <input type="text" :value="detail.createdAt" disabled />
        </div>
        <div class="info-row">
          <label>수정 일시</label>
          <input type="text" :value="detail.modifiedAt" disabled />
        </div>
      </div>
    </template>

    <template #detail>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>카테고리 ID</th>
            <th>카테고리명</th>
            <th>제품 개수</th>
            <th>등록 일시</th>
            <th>수정 일시</th>
            <th>상태 변경</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="category in pagedCategories" :key="category.categoryId">
            <td>{{ category.categoryId }}</td>

            <td>
              <template v-if="editingCategoryId === category.categoryId">
                <input v-model="editedCategory.categoryName" />
              </template>
              <template v-else>
                {{ category.categoryName }}
              </template>
            </td>

            <td>{{ category.productCount }}</td>
            <td>{{ category.categoryCreatedAt }}</td>
            <td>{{ category.categoryModifiedAt }}</td>

            <td>
              <template v-if="editingCategoryId === category.categoryId">
                <button @click="saveCategoryEdit(category)">저장</button>
                <button @click="cancelCategoryEdit">취소</button>
              </template>
              <template v-else>
                <button class="action-btn" @click="openCategoryEditModal(category)">수정</button>
                <button class="action-btn red" @click="deleteCategoryHandler(category)">삭제</button>
              </template>
            </td>
          </tr>
          </tbody>
        </table>
        <Pagination v-model="page" :total-items="detail.categories.length" :items-per-page="itemsPerPage" />
      </div>
    </template>
  </DetailLayout>

  <CategoryModal
      v-if="showCategoryModal"
      :is-top="false"
      :category-edit-data="selectedCategory"
      :top-categories="topCategories"
      @close="showCategoryModal = false"
      @refresh="handleRefresh"
  />

  <!-- 등록/수정 완료 모달 -->
  <CategoryDoneModal
      v-if="doneModal.show"
      :type="doneModal.type"
      :is-top="doneModal.isTop"
      @close="doneModal.show = false"
  />

  <div>
    <CategoryErrorModal
        v-if="ErrorOpen"
        :message="ErrorMsg"
        @close="ErrorOpen = false"
    />
  </div>

  <!-- 삭제 확인 모달 -->
  <CategoryDeleteConfirmModal
      v-if="deleteTarget"
      :target-id="deleteTarget.id"
      :is-top="deleteTarget.isTop"
      @close="deleteTarget = null"
      @deleted="loadTopCategory"
  />

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import Pagination from '@/components/common/Pagination.vue'
import {
  fetchTopCategoryWithProducts,
  fetchAllListTopCategories,
  fetchAllTopCategories,
  updateTopCategory,
  updateCategory,
  deleteCategory
} from '@/features/category/api.js'
import CategoryModal from '@/features/category/components/CategoryModal.vue'
import CategoryErrorModal from "@/features/category/components/CategoryErrorModal.vue";
import CategoryDoneModal from "@/features/category/components/CategoryDoneModal.vue";
import CategoryDeleteConfirmModal from "@/features/category/components/CategoryDeleteConfirmModal.vue";

const showCategoryModal = ref(false)
const selectedCategory = ref(null)

const route = useRoute()
const topCategoryId = route.params.topCategoryId

const detail = ref({
  topCategoryName: '',
  productCount: 0,
  createdAt: '',
  modifiedAt: '',
  categories: []
})

const isEditing = ref(false)
const page = ref(1)
const itemsPerPage = 5
const ErrorOpen = ref(false)
const ErrorMsg = ref('')
const deleteTarget = ref(null)

function showError(msg) {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

const editingCategoryId = ref(null)
const editedCategory = ref({
  categoryName: '',
  categoryCode: '',
  topCategoryId: ''
})

// 등록/수정 완료 모달 상태
const doneModal = ref({
  show: false,
  type: 'edit',    //  'register' | 'edit' | 'delete'
  isTop: false
})

const topCategories = ref([])

const loadTopCategory = async () => {
  // 1. 상세 데이터(카테고리 목록 포함)
  const res = await fetchTopCategoryWithProducts(topCategoryId)
  const topCategoryData = res.data.data

  // 2. 드롭다운용 상위카테고리 리스트
  const allListRes = await fetchAllListTopCategories()
  const listTopCategories = Array.isArray(allListRes.data.data) ? allListRes.data.data : []

  topCategories.value = listTopCategories.map(top => ({
    label: top.topCategoryName,
    value: String(top.topCategoryId)
  }))

  // 3. 병합용 전체(상위+하위 포함) 상위카테고리
  const allTopRes = await fetchAllTopCategories()
  // 구조: { data: { topCategories: [...] } }
  const allTopCategories = Array.isArray(allTopRes.data.data.topCategories)
      ? allTopRes.data.data.topCategories
      : []

  // 4. 하위카테고리 병합 (카테고리 코드/상위명/ID 등)
  topCategoryData.categories = (topCategoryData.categories ?? []).map(cat => {
    let matchedTop = allTopCategories.find(top =>
        (top.categories ?? []).some(c => c.categoryId === cat.categoryId)
    )
    let matchedCategory = matchedTop?.categories?.find(c => c.categoryId === cat.categoryId)

    return {
      ...cat,
      categoryCode: matchedCategory?.categoryCode ?? '',
      topCategoryId: String(matchedTop?.topCategoryId ?? ''),
      topCategoryName: matchedTop?.topCategoryName ?? ''
    }
  })
  detail.value = topCategoryData
}

const saveEdit = async () => {
  try {
    await updateTopCategory(topCategoryId, {
      topCategoryName: detail.value.topCategoryName
    })
    doneModal.value = { show: true, type: 'edit', isTop: true }
    isEditing.value = false
    await loadTopCategory()
  } catch (e) {
    showError( '수정 실패했습니다.')
  }
}

const pagedCategories = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const arr = detail.value.categories.slice(start, start + itemsPerPage)
  return arr
})

const openCategoryEditModal = (category) => {
  // 병합된 데이터에서 정확한 categoryId 찾아서 넘김
  const fullCategory = detail.value.categories.find(c => c.categoryId === category.categoryId)
  selectedCategory.value = { ...fullCategory,
    topCategoryId: String(fullCategory.topCategoryId)
  }
  showCategoryModal.value = true
}

const cancelCategoryEdit = () => {
  editingCategoryId.value = null
  editedCategory.value = {
    categoryName: '',
    categoryCode: '',
    topCategoryId: ''
  }
}

const handleRefresh = async (opts = {}) => {
  await loadTopCategory()
  showCategoryModal.value = false // 모달 닫기
  // 수정 완료 모달 옵션으로 오면 띄움
  if (opts && opts.showDone) {
    doneModal.value = {
      show: true,
      type: opts.type ?? 'edit',
      isTop: opts.isTop ?? false
    }
  }
}

const saveCategoryEdit = async (category) => {
  try {
    await updateCategory(category.categoryId, { ...editedCategory.value })
    await loadTopCategory()
    cancelCategoryEdit()
    doneModal.value = { show: true, type: 'edit', isTop: false }
  } catch (e) {
    return showError('하위 카테고리 수정 실패했습니다.')
  }
}

const getTopCategoryName = (id) => {
  const match = topCategories.value.find(t => t.topCategoryId === id)
  return match ? match.topCategoryName : '-'
}

const handleDelete = () => {
  if (detail.value.categories.length > 0) {
    return showError( '하위 카테고리가 존재하여 삭제할 수 없습니다.')
  }
  deleteTarget.value = { id: topCategoryId, isTop: true }
}

const deleteCategoryHandler = (category) => {
  if (category.productCount > 0) {
    return showError('해당 카테고리에 연결된 제품이 있어 삭제할 수 없습니다.')
  }
  deleteTarget.value = { id: category.categoryId, isTop: false }
}

onMounted(() => {
  loadTopCategory()
})

</script>

<style scoped>
.info-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 2rem;
  margin-bottom: 2rem;
}
.info-row {
  display: flex;
  flex-direction: column;
}
.info-row label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.info-row input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
}
.info-row input:read-only {
  background: #f3f3f3;
}
.table-wrapper {
  margin-top: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  background: #f3f3f3;
  padding: 0.75rem;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
tbody td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: center;
}
button {
  padding: 4px 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background: #eee;
  cursor: pointer;
}

.action-btn {
  min-width: 44px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.15s;
  background: #f5f7fa;
  color: #357ae8;
  margin: 0 2px;
}
.action-btn:hover {
  background: #e3eefd;
  color: #185adf;
  border-color: #357ae8;
  box-shadow: 0 1px 4px rgba(53, 122, 232, 0.09);
}

.action-btn.red {
  background: #fff5f5;
  color: #df2121;
  border: 1px solid #f7cccc;
}
.action-btn.red:hover {
  background: #ffe5e5;
  color: #a30c0c;
  border-color: #df2121;
  box-shadow: 0 1px 4px rgba(223,33,33,0.07);
}
</style>
