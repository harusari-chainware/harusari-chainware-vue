<script setup>
import { ref, computed, watch } from 'vue'
import {
  fetchTakebackProductsAPI,
  registerTakebackDisposalAPI,
  searchTakeBackCodesAPI
} from '@/features/disposal/api.js'

const emit = defineEmits(['submitted'])

const takebackKeyword = ref('')
const productKeyword = ref('')
const quantity = ref(null)
const reason = ref('')
const selectedTakeback = ref(null)
const selectedProduct = ref(null)
const filteredTakebacks = ref([])
const filteredProducts = ref([])

const takebackInfo = computed(() => {
  const t = selectedTakeback.value
  return t ? `${t.takeBackCode} (${t.createdDate}, ${t.franchiseName})` : ''
})

const productInfo = computed(() => {
  const p = selectedProduct.value
  return p ? `${p.productName} (${p.productCode})` : ''
})

const takebackInfoText = computed(() => {
  return selectedTakeback.value
      ? `${selectedTakeback.value.takeBackCode} (${selectedTakeback.value.createdDate}, ${selectedTakeback.value.franchiseName})`
      : '반품 ID를 검색하면 정보가 표시됩니다.'
})

const productInfoText = computed(() => {
  return selectedProduct.value
      ? `${selectedProduct.value.productName} (${selectedProduct.value.productCode})`
      : '상품을 검색하면 정보가 표시됩니다.'
})

const productStockText = computed(() => {
  return selectedProduct.value
      ? `${selectedProduct.value.stock}개`
      : '상품을 선택하면 반품 수량이 표시됩니다.'
})


const selectTakeback = async (item) => {
  selectedTakeback.value = item
  takebackKeyword.value = item.takeBackCode
  filteredTakebacks.value = []

  try {
    const res = await fetchTakebackProductsAPI(item.takeBackId)
    const data = res?.data?.data
    filteredProducts.value = Array.isArray(data) ? [...data] : []
  } catch (e) {
    console.error('반품 상품 조회 실패', e)
    filteredProducts.value = []
  }
}

const selectProduct = (item) => {
  selectedProduct.value = item
  productKeyword.value = item.productName
  filteredProducts.value = []
}

watch(takebackKeyword, async (val) => {
  if (val.trim().length < 2) return (filteredTakebacks.value = [])
  try {
    const res = await searchTakeBackCodesAPI(val.trim())
    filteredTakebacks.value = res?.data?.data || []
  } catch (e) {
    console.error('반품 검색 실패', e)
    filteredTakebacks.value = []
  }
})

const resetForm = () => {
  takebackKeyword.value = ''
  productKeyword.value = ''
  quantity.value = null
  reason.value = ''
  selectedTakeback.value = null
  selectedProduct.value = null
  filteredTakebacks.value = []
  filteredProducts.value = []
}

const submitForm = async () => {
  if (!selectedTakeback.value || !selectedProduct.value || !quantity.value || !reason.value) {
    alert('모든 필드를 올바르게 입력해주세요.')
    return
  }

  const payload = {
    takeBackId: selectedTakeback.value.takeBackId,
    productId: selectedProduct.value.productId,
    quantity: quantity.value,
    disposalReason: reason.value.trim()
  }

  try {
    await registerTakebackDisposalAPI(payload)
    emit('submitted')
    resetForm()
    alert('반품 폐기 등록 완료')
  } catch (e) {
    console.error('[반품 폐기 등록 실패]', e)
    alert('오류가 발생했습니다')
  }
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="form-grid">
      <!-- 반품 ID -->
      <div class="form-group">
        <label class="form-label required-mark">반품 ID 검색</label>
        <input type="text" v-model="takebackKeyword" class="form-control" placeholder="반품 ID 입력" />
        <ul v-if="filteredTakebacks.length" class="product-search-results">
          <li v-for="item in filteredTakebacks" :key="item.takeBackId" class="product-search-item" @mousedown.prevent="selectTakeback(item)">
            <div class="product-name">{{ item.takeBackCode }}</div>
            <div class="product-info">날짜: {{ item.createdDate }} | 가맹점: {{ item.franchiseName }}</div>
          </li>
        </ul>
      </div>

      <!-- 반품 정보 -->
      <div class="form-group">
        <label class="form-label">반품 정보</label>
        <input type="text" class="form-control bg-disabled" :value="takebackInfoText" disabled />
      </div>

      <!-- 상품 검색 -->
      <div class="form-group">
        <label class="form-label required-mark">상품 검색</label>
        <input type="text" v-model="productKeyword" class="form-control" placeholder="상품명 또는 코드 입력" />
        <ul v-if="filteredProducts.length" class="product-search-results">
          <li v-for="product in filteredProducts" :key="product.productId" class="product-search-item" @mousedown.prevent="selectProduct(product)">
            <div class="product-name">{{ product.productName }}</div>
            <div class="product-info">코드: {{ product.productCode }} | 반품 수량: {{ product.stock }}개</div>
          </li>
        </ul>
      </div>

      <!-- 상품 정보 -->
      <div class="form-group">
        <label class="form-label">상품 정보</label>
        <input type="text" class="form-control bg-disabled" :value="productInfoText" disabled />
      </div>

      <!-- 폐기 수량 -->
      <div class="form-group">
        <label class="form-label required-mark">폐기 수량</label>
        <input type="number" v-model.number="quantity" class="form-control" min="1" placeholder="폐기 수량 입력" />
      </div>

      <!-- 반품 수량 -->
      <div class="form-group">
        <label class="form-label">반품 수량</label>
        <input type="text" class="form-control bg-disabled" :value="productStockText" disabled />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label required-mark">폐기 사유</label>
      <textarea v-model="reason" class="form-textarea" placeholder="폐기 사유를 상세히 입력해주세요"></textarea>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="resetForm">초기화</button>
      <button type="submit" class="btn btn-primary">폐기 등록</button>
    </div>
  </form>
</template>

<style scoped>
/* 📦 일반 폐기와 동일한 스타일 구성 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}
.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 6px;
}
.required-mark::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}
.form-control {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.form-control:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}
.bg-disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
}
.form-textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
.btn {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary {
  background-color: #4f46e5;
  color: white;
}
.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}
.product-search-results {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  width: 100%;
  background-color: #fffbe6;
  border: 1px dashed #f87171;
  border-radius: 6px;
  padding: 8px;
  margin-top: 4px;
}
.product-search-item {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}
.product-search-item:hover {
  background-color: #fef3c7;
}
.product-name {
  font-weight: bold;
}
.product-info {
  font-size: 12px;
  color: #666;
}
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
