<script setup>
import { ref, computed, watch } from 'vue'
import { registerNormalDisposalAPI, searchDisposalProductsAPI } from '@/features/disposal/api.js'
import { useAuthStore } from '@/features/auth/useAuthStore'

const emit = defineEmits(['submitted'])

const auth = useAuthStore()
const disposalType = computed(() => {
  return auth.role === 'WAREHOUSE_MANAGER' ? 'WAREHOUSE' : 'FRANCHISE'
})

const searchKeyword = ref('')
const quantity = ref(null)
const reason = ref('')
const selectedProduct = ref(null)
const filteredProducts = ref([])

const productInfo = computed(() => {
  return selectedProduct.value
      ? `${selectedProduct.value.productName} (${selectedProduct.value.productCode})`
      : '상품을 검색하면 정보가 표시됩니다.'
})

const currentStockInfo = computed(() => {
  return selectedProduct.value
      ? `${selectedProduct.value.stock}개`
      : '상품을 검색하면 현재 재고가 표시됩니다.'
})

const handleSelect = (product) => {
  selectedProduct.value = product
  searchKeyword.value = product.productName
  filteredProducts.value = []
}

const submitForm = async () => {
  if (!selectedProduct.value && filteredProducts.value.length > 0) {
    handleSelect(filteredProducts.value[0])
  }

  if (
      !selectedProduct.value ||
      quantity.value === null ||
      isNaN(quantity.value) ||
      quantity.value <= 0 ||
      reason.value.trim() === ''
  ) {
    alert('모든 필드를 올바르게 입력해주세요.')
    return
  }

  const payload = {
    productId: selectedProduct.value.productId,
    quantity: quantity.value,
    disposalReason: reason.value.trim()
  }

  try {
    await registerNormalDisposalAPI(payload)
    resetForm()
    emit('submitted')
  } catch (e) {
    console.error('[등록 실패]', e)
  }
}

const resetForm = () => {
  searchKeyword.value = ''
  quantity.value = null
  reason.value = ''
  selectedProduct.value = null
  filteredProducts.value = []
}

watch(searchKeyword, async (val) => {
  if (val.trim().length < 2) {
    filteredProducts.value = []
    return
  }

  try {
    const res = await searchDisposalProductsAPI({
      keyword: val.trim(),
      type: disposalType.value
    })
    const products = res?.data?.data
    filteredProducts.value = Array.isArray(products) ? [...products] : []
  } catch (e) {
    console.error('상품 검색 실패:', e)
    filteredProducts.value = []
  }
})
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label required-mark">상품 검색</label>
        <input
            type="text"
            v-model="searchKeyword"
            class="form-control"
            placeholder="상품명 또는 코드 입력"
        />

        <ul
            v-if="searchKeyword.length >= 2 && filteredProducts.length > 0 && !selectedProduct"
            class="product-search-results"
        >
          <li
              v-for="product in filteredProducts"
              :key="product.productId"
              class="product-search-item"
              @mousedown.prevent="handleSelect(product)"
          >
            <div class="product-name">{{ product.productName }}</div>
            <div class="product-info">
              코드: {{ product.productCode }} | 재고: {{ product.stock }}개
            </div>
          </li>
        </ul>
        <ul
            v-else-if="searchKeyword.length >= 2 && !selectedProduct"
            class="product-search-results"
        >
          <li class="product-empty">💡 검색된 상품이 없습니다</li>
        </ul>
      </div>

      <div class="form-group">
        <label class="form-label">상품 정보</label>
        <input
            type="text"
            class="form-control bg-disabled"
            :value="productInfo"
            disabled
        />
      </div>

      <div class="form-group">
        <label class="form-label required-mark">폐기 수량</label>
        <input
            type="number"
            v-model.number="quantity"
            class="form-control"
            min="1"
            placeholder="폐기 수량 입력"
        />
      </div>

      <div class="form-group">
        <label class="form-label">현재 재고</label>
        <input
            type="text"
            class="form-control bg-disabled"
            :value="currentStockInfo"
            disabled
        />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label required-mark">폐기 사유</label>
      <textarea
          v-model="reason"
          class="form-textarea"
          placeholder="폐기 사유를 상세히 입력해주세요"
      ></textarea>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="resetForm">초기화</button>
      <button type="submit" class="btn btn-primary">폐기 등록</button>
    </div>
  </form>
</template>

<style scoped>
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
.product-empty {
  padding: 8px;
  color: #b91c1c;
  font-size: 14px;
}
.product-name {
  font-weight: bold;
}
.product-info {
  font-size: 12px;
  color: #666;
}
</style>
