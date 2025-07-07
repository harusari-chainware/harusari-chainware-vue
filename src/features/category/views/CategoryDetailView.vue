<template>
  <DetailLayout title="카테고리 상세 조회" description="카테고리와 연결된 제품 정보를 확인할 수 있습니다.">
    <!-- 상단 버튼 -->
    <template #actions>
      <StatusButton type="primary" @click="handleEditOrSave">
        {{ isEditing ? '저장' : '수정' }}
      </StatusButton>
      <template v-if="isEditing">
        <StatusButton type="default" @click="cancelEdit">취소</StatusButton>
      </template>
      <template v-else>
        <StatusButton type="danger" @click="handleDelete">삭제</StatusButton>
      </template>
    </template>

    <!-- 기본 정보 -->
    <template #basic>
      <div class="info-group">
        <!-- 대분류 -->
        <div class="info-row">
          <label>대분류</label>
          <select v-if="isEditing" v-model="selectedTopCategoryId" class="modal-input">
            <option disabled value="">상위 카테고리를 선택하세요</option>
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

        <!-- 소분류 -->
        <div class="info-row">
          <label>소분류</label>
          <select v-if="isEditing" v-model="category.categoryId" class="modal-input">
            <option disabled value="">소분류를 선택하세요</option>
            <option
                v-for="cat in filteredCategories"
                :key="cat.categoryId"
                :value="cat.categoryId"
            >
              {{ cat.categoryName }}
            </option>
          </select>
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
              @input="category.categoryCode = category.categoryCode.toUpperCase()"
              class="modal-input"
              placeholder="예: CF"
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
            <td>{{ product.productCode }}</td>
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
  fetchAllTopCategories,
  fetchTopCategoriesWithChildren,
  fetchCategoryDetail,
  updateCategory,
} from '@/api/categoryApi'

const route = useRoute()
const categoryId = route.params.categoryId

const topCategories = ref([])
const allCategories = ref([])
const selectedTopCategoryId = ref(null)
const filteredCategories = computed(() =>
    allCategories.value.filter(cat => cat.topCategoryId === selectedTopCategoryId.value)
)

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

const products = ref([])
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
})

const isEditing = ref(false)
const page = ref(1)
const itemsPerPage = 5

const pagedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

const loadCategory = async () => {
  const res = await fetchCategoryDetail(categoryId, page.value, itemsPerPage)
  const data = res.data.data

  category.value = {
    categoryId: data.categoryMeta.categoryId,
    categoryName: data.categoryMeta.categoryName,
    categoryCode: data.categoryMeta.categoryCode,
    topCategoryName: data.topCategory.topCategoryName,
    topCategoryId: data.topCategory.topCategoryId,
    productCount: data.categoryMeta.productCount,
    createdAt: data.categoryMeta.createdAt,
    modifiedAt: data.categoryMeta.modifiedAt
  }

  products.value = data.products
  pagination.value = data.pagination
}

const cancelEdit = () => {
  isEditing.value = false
  selectedTopCategoryId.value = category.value.topCategoryId
}

const handleEditOrSave = async () => {
  if (isEditing.value) {
    const selectedCategory = allCategories.value.find(
        c => c.categoryId === category.value.categoryId
    )
    if (!selectedCategory) {
      alert('소분류를 선택하세요.')
      return
    }

    // ✅ 유효성 검사
    if (!/^[A-Z]{2}$/.test(category.value.categoryCode)) {
      alert('카테고리 코드는 대문자 2자리로 입력해주세요. (예: CF)')
      return
    }


    try {
      await updateCategory(category.value.categoryId, {
        categoryName: category.value.categoryName,
        categoryCode: category.value.categoryCode,
        topCategoryId: selectedTopCategoryId.value
      })
      console.log('📦 저장 요청 데이터:', {
        categoryName: category.value.categoryName,
        categoryCode: category.value.categoryCode,
        topCategoryId: selectedTopCategoryId.value
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
    isEditing.value = true
  }
}

const handleDelete = () => {
  if (category.value.productCount > 0) {
    alert('해당 카테고리에 연결된 제품이 있어 삭제할 수 없습니다.')
    return
  }
  if (confirm('정말 삭제하시겠습니까?')) {
    alert('삭제 처리') // TODO: 삭제 API 연결
  }
}

watch(isEditing, async (newVal) => {
  if (newVal) {
    const res = await fetchTopCategoriesWithChildren();
    topCategories.value = res.data.data.topCategories;

    // ✅ 이 값이 null이면 소분류가 안 뜸
    selectedTopCategoryId.value = category.value.topCategoryId;

    allCategories.value = topCategories.value.flatMap(t =>
        (t.categories || []).map(cat => ({
          ...cat,
          topCategoryId: t.topCategoryId
        }))
    );

    console.log('✅ selectedTopCategoryId:', selectedTopCategoryId.value);
    console.log('✅ allCategories:', allCategories.value);
  }
});

watch(page, () => {
  loadCategory()
})

onMounted(() => {
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
</style>
