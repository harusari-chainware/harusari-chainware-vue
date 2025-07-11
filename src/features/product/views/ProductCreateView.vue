<template>
  <ProductLayout title="제품 등록" description="제품을 등록할 수 있습니다.">
    <template #basic>
      <div class="product-form-card">
        <h2 class="form-title">제품 정보 입력</h2>
        <div class="form-grid">
          <!-- 좌측 컬럼 -->
          <div class="form-col">
            <div class="form-row">
              <label>제품명</label>
              <input v-model="form.productName" type="text" class="input" />
            </div>
            <div class="form-row">
              <label>단가</label>
              <input v-model="form.basePrice" type="number" min="0" class="input" autocomplete="off" />
            </div>
            <div class="form-row">
              <label>제품 단위</label>
              <input v-model="form.unitQuantity" type="number" min="0" class="input" placeholder="수량" autocomplete="off" />
              <input v-model="form.unitSpec" type="text" class="input ml-2" placeholder="규격" />
            </div>
            <div class="form-row">
              <label>원산지</label>
              <input v-model="form.origin" type="text" class="input" />
            </div>
          </div>
          <!-- 우측 컬럼 -->
          <div class="form-col">
            <div class="form-row">
              <label>카테고리</label>
              <select v-model="form.topCategoryId" class="input">
                <option value="">상위 카테고리</option>
                <option v-for="cat in topCategoryOptions" :value="cat.value" :key="cat.value">
                  {{ cat.label }}
                </option>
              </select>
              <select v-model="form.categoryId" class="input ml-2">
                <option value="">카테고리</option>
                <option v-for="cat in categoryOptions" :value="cat.value" :key="cat.value">
                  {{ cat.label }}
                </option>
              </select>
              <input v-model="form.categoryCode" class="input ml-2" placeholder="카테고리 코드" readonly />
            </div>
            <div class="form-row">
              <label>보관상태</label>
              <select v-model="form.storeType" class="input">
                <option v-for="opt in storeTypeOptions" :value="opt.value" :key="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <label>안전 재고 수량</label>
              <input v-model="form.safetyStock" type="number" min="0" class="input" autocomplete="off" />
            </div>
            <div class="form-row">
              <label>유통기한</label>
              <input v-model="form.shelfLife" type="number" min="0" class="input" placeholder="예: 180" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </ProductLayout>
    <div class="form-actions">
      <StatusButton type="primary" @click="handleSubmit">등록</StatusButton>
      <StatusButton type="default" @click="handleCancel">취소</StatusButton>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import StatusButton from '@/components/common/StatusButton.vue'
import {fetchAllListTopCategories, fetchAllTopCategories} from '@/features/category/api.js'
import { createProduct } from '@/features/product/api.js'
import ProductLayout from "@/features/product/components/ProductLayout.vue";

// 폼 상태
const form = ref({
  productName: '',
  topCategoryId: '',
  categoryId: '',
  categoryCode: '',
  basePrice: '',
  origin: '',
  storeType: '',
  safetyStock: '',
  unitQuantity: '',
  unitSpec: '',
  shelfLife: '',
})

// 드롭다운용 옵션
const topCategoryOptions = ref([])
const categoryOptions = ref([])

// 상위 카테고리 불러오기
async function loadTopCategories() {
  const res = await fetchAllListTopCategories()
  const arr = res.data.data || res.data
  topCategoryOptions.value = (arr || []).map(item => ({
    value: item.topCategoryId,
    label: item.topCategoryName
  }))
}

// 하위 카테고리 불러오기 (상위 카테고리 id 기준)
async function loadSubCategories(topCategoryId) {
  if (!topCategoryId) {
    categoryOptions.value = []
    return
  }
  const res = await fetchAllTopCategories({ topCategoryId })
  // 응답 구조: data.data.topCategories[n].categories
  const topCats = res.data.data.topCategories || []
  const found = topCats.find(cat => String(cat.topCategoryId) === String(topCategoryId))
  categoryOptions.value = (found?.categories || []).map(item => ({
    value: item.categoryId,
    label: item.categoryName,
    code: item.categoryCode
  }))
}

// 처음 진입 시 상위 카테고리 불러오기
onMounted(() => {
  loadTopCategories()
})

// 상위 카테고리 바뀌면 하위 카테고리 불러오기
watch(() => form.value.topCategoryId, (newVal) => {
  loadSubCategories(newVal)
})

watch(() => form.value.categoryId, (newVal) => {
  const selected = categoryOptions.value.find(opt => String(opt.value) === String(newVal))
  form.value.categoryCode = selected ? selected.code : ''
})

const router = useRouter()

const storeTypeOptions = [
  { value: '', label: '선택' },
  { value: 'ROOM_TEMPERATURE', label: 'ROOM_TEMPERATURE' },
  { value: 'CHILLED', label: 'CHILLED' },
  { value: 'FROZEN', label: 'FROZEN' },
]

const submitting = ref(false)
const handleSubmit = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    await createProduct(form.value)
    router.push('/product/list')
  } catch (e) {
    alert('제품 등록에 실패했습니다.')
  } finally {
    submitting.value = false;
  }
}

const handleCancel = () => {
  router.push('/product/list')
}
</script>

<style scoped>
.product-form-card {
  gap: 2rem;
  transition: all 0.3s ease;
  background-color: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  margin: 40px auto 0 auto;
  width: 100%;
}
.form-title {
  font-size: var(--font-page-title-small);
  font-weight: bold;
  color: var(--color-gray-700);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.75rem;
  margin-left: 0.5rem;
  margin-bottom: 3rem;
}
.form-grid {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: 2rem;
}
.form-col {
  flex: 1;
  min-width: 330px;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.form-row label {
  flex: 0 0 100px;
  font-weight: 500;
  margin-right: 12px;
  color: #2b2b2b;
}
.input {
  padding: 0.5rem 0.75rem;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-info-value);
  color: var(--color-gray-900);
  min-height: 2.2rem;
  display: flex;
  align-items: center;
}
.ml-2 {
  margin-left: 12px;
}

.input[type="number"]::-webkit-outer-spin-button,
.input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

.form-grid {
  display: flex;
  gap: 48px;
}
.form-col {
  flex: 1;
  min-width: 330px;
}
@media (max-width: 900px) {
  .form-grid {
    flex-direction: column;
    gap: 24px;
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
}

</style>
