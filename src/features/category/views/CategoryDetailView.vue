<template>
  <DetailLayout title="카테고리 상세 조회" description="카테고리와 연결된 제품 정보를 확인할 수 있습니다.">
    <!-- 상단 버튼 -->
    <template #actions>
      <template v-if="!isEditing">
        <StatusButton type="primary" @click="startEdit">수정</StatusButton>
        <button class="danger" @click="handleDelete">삭제</button>
      </template>

      <template v-else>
        <!-- 저장 버튼 클릭 시 handleEditOrSave 함수 호출 -->
        <StatusButton type="primary" @click="handleEditOrSave">저장</StatusButton>
        <StatusButton type="default" @click="cancelEdit">취소</StatusButton>
      </template>
    </template>

    <!-- 기본 정보 -->
    <template #basic>
      <div v-if="!isLoading" class="info-group">
<!--      <div class="info-group">-->
        <!-- 상위 카테고리명 -->
        <div class="info-row">
          <label>상위 카테고리명</label>
          <select v-if="isEditing" v-model="selectedTopCategoryId" class="modal-input">
            <option disabled value="">상위 카테고리명을 선택하세요</option>
            <option
                v-for="top in topCategories"
                :key="top.topCategoryId"
                :value="top.topCategoryId"
            >
              {{ top.topCategoryName }}
            </option>
          </select>
          <input v-else type="text" :value="category.topCategoryName" readonly />
        </div>

        <!-- 카테고리명 -->
        <div class="info-row">
          <label>카테고리명</label>
          <input
              v-if="isEditing"
              v-model="category.categoryName"
              class="modal-input"
              placeholder="카테고리명을 입력하세요"
              maxlength="20"
          />
          <input
              v-else
              type="text"
              :value="category.categoryName"
              readonly
          />
        </div>

        <!-- 카테고리 코드 -->
        <div class="info-row">
          <label>카테고리 코드</label>
          <input
              v-if="isEditing"
              v-model="category.categoryCode"
              @input="category.categoryCode = category.categoryCode.toUpperCase().slice(0,2)"
              class="modal-input"
              placeholder="예: CF"
              maxlength="2"
          />
          <input
              v-else
              type="text"
              :value="category.categoryCode"
              readonly
          />
        </div>

        <!-- 제품 수, 등록일시, 수정일시 -->
        <div class="info-row">
          <label>총 제품 개수</label>
          <input type="text" :value="category.productCount" disabled />
        </div>
        <div class="info-row">
          <label>등록 일시</label>
          <input type="text" :value="category.createdAt" disabled />
        </div>
        <div class="info-row">
          <label>수정 일시</label>
          <input type="text" :value="category.modifiedAt" disabled />
        </div>
      </div>

      <div v-else style="padding:2rem;text-align:center;">로딩중...</div>
    </template>

    <!-- 제품 테이블 -->
    <template #detail>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>제품 ID</th>
            <th>제품코드</th>
            <th>제품명</th>
            <th>단가</th>
            <th>제품 상태</th>
            <th>등록 일시</th>
            <th>수정 일시</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in pagedProducts" :key="product.productId">
            <td>{{ product.productId }}</td>
            <td>{{ getDisplayProductCode(product, category.categoryCode) }}</td>
            <td>{{ product.productName }}</td>
            <td>{{ product.basePrice }}</td>
            <td>{{ product.productStatus ? '활성' : '비활성' }}</td>
            <td>{{ product.productCreatedAt }}</td>
            <td>{{ product.productModifiedAt || '-' }}</td>
          </tr>
          </tbody>
        </table>
        <Pagination
            v-model="page"
            :total-items="pagination.totalItems"
            :items-per-page="itemsPerPage"
        />
      </div>
    </template>
  </DetailLayout>

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
      @deleted="onDeleteSuccess"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import Pagination from '@/components/common/Pagination.vue'
import {
  fetchAllListTopCategories,
  fetchAllTopCategories,
  fetchCategoryDetail,
  updateCategory,
  deleteCategory
} from '@/features/category/api.js'
import CategoryErrorModal from "@/features/category/components/CategoryErrorModal.vue";
import CategoryDeleteConfirmModal from "@/features/category/components/CategoryDeleteConfirmModal.vue";
import CategoryDoneModal from "@/features/category/components/CategoryDoneModal.vue";

function getDisplayProductCode(product, categoryCode) {
  // product.sequence 또는 product.productId 중 원하는 값 사용!
  // 예: sequence가 1, categoryCode가 'ED'면 -> 'PD-ED-001'
  // product.sequence 필드가 없다면 product.productId를 써도 됨!
  const seq = product.sequence ?? product.productId;
  return `PD-${categoryCode}-${String(seq).padStart(3, '0')}`;
}

const isLoading = ref(true)

const deleteTarget = ref(null)
const ErrorOpen = ref(false)
const ErrorMsg = ref('')
function showError(msg) {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

// 등록/수정 완료 모달 상태
const doneModal = ref({
  show: false,
  type: 'edit',    // 'register' | 'edit'
  isTop: false
})

const route = useRoute()
const categoryId = route.params.categoryId

// 상위카테고리 목록 (상위카테고리만)
const topCategories = ref([])

// 하위카테고리 포함 전체 트리 (상위+하위 정보)
const allCategories = ref([])

// 선택된 상위카테고리 ID (수정 모드 시 드롭다운 바인딩용)
const selectedTopCategoryId = ref(null)

// 현재 상세 보고 있는 카테고리 데이터 (상위카테고리명 포함)
const category = ref({
  categoryId: null,
  categoryName: '',
  categoryCode: '',
  topCategoryName: '',
  topCategoryId: null,
  productCount: 0,
  createdAt: '',
  modifiedAt: ''
})

// 제품 리스트, 페이징 정보
const products = ref([])
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
})

const originalCategory = ref(null)
const isEditing = ref(false)
const page = ref(1)
const itemsPerPage = 5

const startEdit = () => {
  if (isLoading.value) return
  originalCategory.value = JSON.parse(JSON.stringify(category.value))
  selectedTopCategoryId.value = category.value.topCategoryId
  isEditing.value = true
  console.log("startEdit 직전", category.value)
}

// 페이지네이션에 맞게 제품 리스트 자름
const pagedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

// API 호출: 상위 카테고리 목록만 (드롭다운 용)
const loadTopCategoryList = async () => {
  try {
    const res = await fetchAllListTopCategories()
    topCategories.value = res.data?.data ?? []
  } catch (e) {
    console.error('상위 카테고리 목록 불러오기 실패', e)
  }
}

// API 호출: 하위 카테고리 포함 전체 트리 (하위카테고리 필터링 및 코드 자동 채움용)
const loadFullCategoryTree = async () => {
  try {
    const res = await fetchAllTopCategories()
    const data = res.data?.data?.topCategories ?? []
    allCategories.value = data.flatMap(top =>
        (top.categories || []).map(cat => ({
          ...cat,
          topCategoryId: top.topCategoryId,
          topCategoryName: top.topCategoryName,
        }))
    )
  } catch (e) {
    console.error('전체 카테고리 트리 불러오기 실패', e)
  }
}

const loadCategory = async () => {
  isLoading.value = true
  try {
    const res = await fetchCategoryDetail(categoryId, page.value, itemsPerPage)
    const data = res.data.data

    // 1. 상세 정보로 세팅
    category.value = {
      categoryId: data.categoryMeta.categoryId,
      categoryName: data.categoryMeta.categoryName,
      categoryCode: '', // 일단 비워두고,
      topCategoryName: data.topCategory.topCategoryName,
      topCategoryId: data.topCategory.topCategoryId,
      productCount: data.categoryMeta.productCount,
      createdAt: data.categoryMeta.createdAt,
      modifiedAt: data.categoryMeta.modifiedAt
    }

    // 2. allCategories에서 코드 찾아서 세팅
    const match = allCategories.value.find(cat => cat.categoryId === category.value.categoryId)
    if (match) {
      category.value.categoryCode = match.categoryCode || ''
    }

    products.value = data.products
    pagination.value = data.pagination

    selectedTopCategoryId.value = category.value.topCategoryId
  } catch (e) {
    console.error('카테고리 상세 불러오기 실패', e)
  } finally {
    isLoading.value = false
  }
}

let lock = false
// 수정 / 저장 토글
const handleEditOrSave = async () => {

  if(lock) return
  lock = true

  try {
    if (isEditing.value) {

      if (!/^[A-Z]{2}$/.test(category.value.categoryCode)) {
        return showError('카테고리 코드는 대문자 2자리로 입력해주세요. (예: CF)')
      }

      try {
        await updateCategory(category.value.categoryId, {
          categoryName: category.value.categoryName,
          categoryCode: category.value.categoryCode,
          topCategoryId: Number(selectedTopCategoryId.value)
        })
        doneModal.value = { show: true, type: 'edit', isTop: false }
        await loadCategory()
        isEditing.value = false
      } catch (err) {
        if (err.response?.status === 409) {
          showError('이미 존재하는 카테고리 코드입니다. 다른 코드를 입력해주세요.')
        } else {
          showError('저장 중 오류가 발생했습니다.')
        }
        console.error(err)
      }
    } else {
      // 수정 모드 진입 시 기존 값 유지
      originalCategory.value = JSON.parse(JSON.stringify(category.value))
      selectedTopCategoryId.value = category.value.topCategoryId
      isEditing.value = true
    }
  } finally {
    lock = false
  }
}

const cancelEdit = () => {
  if (originalCategory.value) {
    category.value = JSON.parse(JSON.stringify(originalCategory.value))
    selectedTopCategoryId.value = originalCategory.value.topCategoryId
  }
  isEditing.value = false
}

// 페이지 바뀌면 제품 리스트 재조회
watch(page, () => {
  loadCategory()
})

// 삭제 처리 (임의 구현, 필요시 연결)
const handleDelete = () => {
  deleteTarget.value = { id: category.value.categoryId, isTop: false }
}

onMounted(() => {
  loadTopCategoryList()
  loadFullCategoryTree()
  loadCategory()
})
</script>

<style scoped>
.info-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 2rem;
  max-width: 1000px;
  margin: 0 auto 2rem auto;
}
@media (min-width: 768px) {
  .info-group {
    grid-template-columns: repeat(3, 1fr);
  }
}
.info-row {
  display: flex;
  flex-direction: column;
}
.info-row label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.info-row input,
.modal-input {
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

button.danger {
  padding: 6px 16px;
  font-size: var(--font-button);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;

  background-color: #ef4444;
  color: white;
}

button.danger:hover {
  background-color: #dc2626;
}
</style>
