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
                <!--                <button @click="startCategoryEdit(category)">수정</button>-->
                <button @click="openCategoryEditModal(category)">수정</button>
                <!--                <button @click="deleteCategory(category)">삭제</button>-->
                <button @click="deleteCategoryHandler(category)">삭제</button>
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
      @refresh="loadTopCategory"
  />

  <template v-if="showDeleteModal">
    <div class="modal-backdrop">
      <div class="modal-box">
        <h3>삭제 불가</h3>
        <p>하위 카테고리가 존재하여 삭제할 수 없습니다.</p>
        <button class="confirm-btn" @click="showDeleteModal = false">확인</button>
      </div>
    </div>
  </template>
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
} from '@/api/categoryApi'
import CategoryModal from '@/features/category/components/CategoryModal.vue'

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
const showDeleteModal = ref(false)
const page = ref(1)
const itemsPerPage = 5

const editingCategoryId = ref(null)
const editedCategory = ref({
  categoryName: '',
  categoryCode: '',
  topCategoryId: ''
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


// const loadTopCategory = async () => {
//   const res = await fetchTopCategoryWithProducts(topCategoryId)
//   const topCategoryData = res.data.data
//
//   const allCategoryRes = await fetchAllListTopCategories()
//   const allTopCategories = Array.isArray(allCategoryRes.data.data)
//       ? allCategoryRes.data.data
//       : []
//
//   // 1. 상위 카테고리 옵션을 label/value 구조로 세팅!
//   topCategories.value = (allTopCategories ?? []).map(top => ({
//     label: top.topCategoryName,
//     value: String(top.topCategoryId)
//   }))
//
//   // 2. 하위 카테고리 병합(이 부분은 그대로 OK)
//   topCategoryData.categories = (topCategoryData.categories ?? []).map(cat => {
//     let matchedTop = allTopCategories.find(top =>
//         (top.categories ?? []).some(c => c.categoryId === cat.categoryId)
//     )
//     let matchedCategory = matchedTop?.categories.find(c => c.categoryId === cat.categoryId)
//
//     return {
//       ...cat,
//       categoryCode: matchedCategory?.categoryCode ?? '',
//       topCategoryId: String(matchedTop?.topCategoryId ?? ''),  // ← string 처리!
//       topCategoryName: matchedTop?.topCategoryName ?? ''
//     }
//   })
//   detail.value = topCategoryData
// }


// const topCategories = ref([])
//
// const loadTopCategory = async () => {
//   const res = await fetchTopCategoryWithProducts(topCategoryId)
//   const topCategoryData = res.data.data
//
//   const allCategoryRes = await fetchAllTopCategories()
//   // 응답에 따라 아래처럼 바꾸세요
//   const allTopCategories = allCategoryRes.data.data.topCategories
//
//   topCategoryData.categories = topCategoryData.categories.map(cat => {
//     // topCategories 내 하위 카테고리 배열에서 매칭
//     let matchedTop = allTopCategories.find(top =>
//         (top.categories ?? []).some(c => c.categoryId === cat.categoryId)
//     )
//     let matchedCategory = matchedTop?.categories.find(c => c.categoryId === cat.categoryId)
//
//     return {
//       ...cat,
//       categoryCode: matchedCategory?.categoryCode ?? '',
//       topCategoryId: matchedTop?.topCategoryId ?? '',
//       topCategoryName: matchedTop?.topCategoryName ?? ''
//     }
//   })
//   detail.value = topCategoryData
// }

const saveEdit = async () => {
  try {
    await updateTopCategory(topCategoryId, {
      topCategoryName: detail.value.topCategoryName
    })
    alert('수정 완료')
    isEditing.value = false
    await loadTopCategory()
  } catch (e) {
    alert('수정 실패')
  }
}

const pagedCategories = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return detail.value.categories.slice(start, start + itemsPerPage)
})

const openCategoryEditModal = (category) => {
  // 병합된 데이터에서 정확한 categoryId 찾아서 넘김
  const fullCategory = detail.value.categories.find(c => c.categoryId === category.categoryId)
  console.log('🎯 모달에 넘길 카테고리:', fullCategory)
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

const saveCategoryEdit = async (category) => {
  try {
    await updateCategory(category.categoryId, { ...editedCategory.value })
    await loadTopCategory()
    cancelCategoryEdit()
    alert('하위 카테고리 수정 완료')
  } catch (e) {
    alert('하위 카테고리 수정 실패')
  }
}

const getTopCategoryName = (id) => {
  const match = topCategories.value.find(t => t.topCategoryId === id)
  return match ? match.topCategoryName : '-'
}

const deleteCategoryHandler = async (category) => {
  if (category.productCount > 0) {
    alert('해당 카테고리에 연결된 제품이 있어 삭제할 수 없습니다.')
    return
  }

  if (!confirm(`카테고리 "${category.categoryName}"을 정말 삭제하시겠습니까?`)) {
    return
  }

  try {
    await deleteCategory(category.categoryId)
    alert('카테고리가 삭제되었습니다.')
    await loadTopCategory()
  } catch (e) {
    console.error(e)
    alert('카테고리 삭제 실패')
  }
}

const handleDelete = () => {
  if (detail.value.categories.length > 0) {
    showDeleteModal.value = true
    return
  }
  if (confirm('정말 삭제하시겠습니까?')) {
    alert('삭제 처리') // TODO: 삭제 API 호출
  }
}

onMounted(() => {
  loadTopCategory()
})

// onMounted(async () => {
//   await loadTopCategories()
//   await loadTopCategory()
// })

// onMounted(() => {
//   loadTopCategories()
//   loadTopCategory()
// })
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
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
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 320px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.confirm-btn {
  margin-top: 1rem;
  padding: 6px 12px;
  background: #ffc107;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
