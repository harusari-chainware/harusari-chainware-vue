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

        <!--        &lt;!&ndash; 카테고리명 &ndash;&gt;-->
<!--        <div class="info-row">-->
<!--          <label>카테고리명</label>-->
<!--          <select v-if="isEditing" v-model="category.categoryId" class="modal-input">-->
<!--            <option disabled value="">카테고리명을 선택하세요</option>-->
<!--            <option-->
<!--                v-for="cat in filteredCategories"-->
<!--                :key="cat.categoryId"-->
<!--                :value="cat.categoryId"-->
<!--            >-->
<!--              {{ cat.categoryName }}-->
<!--            </option>-->
<!--          </select>-->
<!--          <input-->
<!--              v-else-->
<!--              type="text"-->
<!--              :value="category.categoryName"-->
<!--              readonly-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; 카테고리 코드 &ndash;&gt;-->
<!--        <div class="info-row">-->
<!--          <label>카테고리 코드</label>-->
<!--          <input-->
<!--              v-if="isEditing"-->
<!--              v-model="category.categoryCode"-->
<!--              @input="category.categoryCode = category.categoryCode.toUpperCase()"-->
<!--              class="modal-input"-->
<!--              placeholder="예: CF"-->
<!--          />-->
<!--          <input-->
<!--              v-else-->
<!--              type="text"-->
<!--              :value="category.categoryCode"-->
<!--              readonly-->
<!--          />-->
<!--        </div>-->

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
<!--            <td>{{ product.productCode }}</td>-->
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import Pagination from '@/components/common/Pagination.vue'
import {
  fetchAllListTopCategories,
  fetchAllTopCategories,
  fetchCategoryDetail,
  updateCategory,
  deleteCategory
} from '@/api/categoryApi'

function getDisplayProductCode(product, categoryCode) {
  // product.sequence 또는 product.productId 중 원하는 값 사용!
  // 예: sequence가 1, categoryCode가 'ED'면 -> 'PD-ED-001'
  // product.sequence 필드가 없다면 product.productId를 써도 됨!
  const seq = product.sequence ?? product.productId;
  return `PD-${categoryCode}-${String(seq).padStart(3, '0')}`;
}

const isLoading = ref(true)

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

// const startEdit = () => {
//   isEditing.value = true
// }

// 하위카테고리 리스트 필터링 (선택된 상위카테고리에 속하는 하위카테고리만)
// const filteredCategories = computed(() =>
//     allCategories.value.filter(cat => cat.topCategoryId === Number(selectedTopCategoryId.value))
// )

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

// 카테고리 상세 및 제품 리스트 조회
// const loadCategory = async () => {
//   isLoading.value = true
//   try {
//     const res = await fetchCategoryDetail(categoryId, page.value, itemsPerPage)
//     const data = res.data.data
//
//     category.value = {
//       categoryId: data.categoryMeta.categoryId,
//       categoryName: data.categoryMeta.categoryName,
//       categoryCode: data.categoryMeta.categoryCode,
//       topCategoryName: data.topCategory.topCategoryName,
//       topCategoryId: data.topCategory.topCategoryId,
//       productCount: data.categoryMeta.productCount,
//       createdAt: data.categoryMeta.createdAt,
//       modifiedAt: data.categoryMeta.modifiedAt
//     }
//     products.value = data.products
//     pagination.value = data.pagination
//
//     // 수정 모드 대비 드롭다운 값 세팅
//     selectedTopCategoryId.value = category.value.topCategoryId
//   } catch (e) {
//     console.error('카테고리 상세 불러오기 실패', e)
//   }finally {
//     isLoading.value = false
//   }
//   }

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
      // 저장 처리
      // if (!category.value.categoryId) {
      //   alert('소분류 카테고리를 선택하세요.')
      //   return
      // }
      if (!/^[A-Z]{2}$/.test(category.value.categoryCode)) {
        alert('카테고리 코드는 대문자 2자리로 입력해주세요. (예: CF)')
        return
      }

      try {
        await updateCategory(category.value.categoryId, {
          categoryName: category.value.categoryName,
          categoryCode: category.value.categoryCode,
          topCategoryId: Number(selectedTopCategoryId.value)
        })
        alert('카테고리 정보가 저장되었습니다.')
        await loadCategory()
        isEditing.value = false
      } catch (err) {
        if (err.response?.status === 409) {
          alert('이미 존재하는 카테고리 코드입니다. 다른 코드를 입력해주세요.')
        } else {
          alert('저장 중 오류가 발생했습니다.')
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

//소분류 선택 변경 시 category명, 코드 자동 세팅 + 상위카테고리도 동기화
// watch(() => category.value.categoryId, (newId) => {
//   const selected = allCategories.value.find(cat => cat.categoryId === newId)
//   if (selected) {
//     category.value.categoryName = selected.categoryName
//     category.value.categoryCode = selected.categoryCode
//     category.value.topCategoryId = selected.topCategoryId
//     selectedTopCategoryId.value = selected.topCategoryId
//   }
// })

//상위카테고리 선택 변경 시 소분류 초기화 혹은 첫 번째 소분류로 변경
// watch(selectedTopCategoryId, (newTopId) => {
//   if (!isEditing.value) return
//   const filtered = allCategories.value.filter(cat => cat.topCategoryId === Number(newTopId))
//   if (!filtered.some(cat => cat.categoryId === category.value.categoryId)) {
//     category.value.categoryId = filtered.length > 0 ? filtered[0].categoryId : null
//   }
// })

// 페이지 바뀌면 제품 리스트 재조회
watch(page, () => {
  loadCategory()
})

// 삭제 처리 (임의 구현, 필요시 연결)
const handleDelete = async () => {
  console.log('handleDelete 호출됨')
  if (confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
    try {
      await deleteCategory(category.value.categoryId)
      alert('카테고리가 삭제되었습니다.')
      // 삭제 후 목록 페이지 등으로 이동 처리 필요
    } catch (e) {
      const errorMessage = e.response?.data?.message || '삭제 중 오류가 발생했습니다.'
      alert(errorMessage)
      console.error('삭제 실패:', e)
    }
  }
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
