<template>
  <DetailLayout
      title="제품 상세 조회"
      description="제품의 상세 정보를 확인할 수 있습니다."
  >
    <!-- 상단 버튼 -->
    <template #actions>a
      <div class="top-actions">
        <StatusButton type="primary" @click="startEdit">수정</StatusButton>
        <StatusButton type="danger" @click="handleDelete">삭제</StatusButton>
      </div>
    </template>

    <!-- 제품 기본 정보 (카테고리 필터와 동일한 흰색 박스) -->
    <template #basic>
      <div class="detail-box">
        <div class="detail-form-row">
          <div class="detail-form-col">
            <label class="detail-label">제품명</label>
            <input class="detail-input" :value="product.productName" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">제품코드</label>
            <input class="detail-input" :value="product.productCode" readonly />
          </div>
        </div>
        <div class="detail-form-row">
          <div class="detail-form-col">
            <label class="detail-label">상위 카테고리명</label>
            <input class="detail-input" :value="product.topCategoryName" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">카테고리명</label>
            <input class="detail-input" :value="product.categoryName" readonly />
          </div>
        </div>
        <div class="detail-form-row">
          <div class="detail-form-col">
            <label class="detail-label">단가</label>
            <input class="detail-input" :value="product.basePrice" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">안전 재고 수량</label>
            <input class="detail-input" :value="product.safetyStock" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">원산지</label>
            <input class="detail-input" :value="product.origin" readonly />
          </div>
        </div>
        <div class="detail-form-row">
          <div class="detail-form-col">
            <label class="detail-label">제품 단위</label>
            <input class="detail-input" :value="product.unitQuantity" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">규격</label>
            <input class="detail-input" :value="product.unitSpec" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">보관상태</label>
            <input class="detail-input" :value="product.storeType" readonly />
          </div>
        </div>
        <div class="detail-form-row">
          <div class="detail-form-col">
            <label class="detail-label">유통기한</label>
            <input class="detail-input" :value="product.shelfLife" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">등록 일시</label>
            <input class="detail-input" :value="product.productCreatedAt" readonly />
          </div>
          <div class="detail-form-col">
            <label class="detail-label">수정 일시</label>
            <input class="detail-input" :value="product.productModifiedAt" readonly />
          </div>
        </div>
      </div>
    </template>

    <!-- 거래(계약) 테이블은 동일하게 아래에 -->
    <template #table>
      <div class="contracts-table">
        <!-- ...생략(위 예시 참고, 테이블 스타일은 일관성 유지)... -->
      </div>
    </template>
  </DetailLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchProductDetail } from "@/api/productApi";
import DetailLayout from "@/components/layout/DetailLayout.vue";
import StatusButton from "@/components/common/StatusButton.vue";
import EmptyResult from "@/components/common/EmptyResult.vue";

const route = useRoute();
const productId = route.params.id;

const product = ref({});
const contracts = ref([]);
const isLoading = ref(true);

const loadProductDetail = async () => {
  isLoading.value = true;
  try {
    const res = await fetchProductDetail(productId);
    const data = res.data.data;
    product.value = {
      ...data.product,
      topCategoryName: data.product.topCategoryName || "",
      categoryName: data.product.categoryName || "",
      productCreatedAt: data.product.productCreatedAt || "",
      productModifiedAt: data.product.productModifiedAt || "",
    };
    contracts.value = data.contracts ?? [];
  } finally {
    isLoading.value = false;
  }
};

const startEdit = () => {};
const handleDelete = () => {};

onMounted(() => {
  loadProductDetail();
});
</script>

<style scoped>
.detail-box {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px 0 var(--color-box-shadow, #e6edf7);
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 680px;
}

.detail-form-row {
  display: flex;
  gap: 32px;
  width: 100%;
  margin-bottom: 16px;
}
.detail-form-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 140px;
}
.detail-label {
  font-weight: 700;
  color: var(--color-gray-900, #222);
  margin-bottom: 7px;
  font-size: 1.08rem;
}
.detail-input {
  border: 1px solid var(--color-gray-200, #dbe4ea);
  border-radius: 8px;
  background: var(--color-bg-light, #f8fafc);
  height: 38px;
  font-size: 1rem;
  padding: 0 14px;
  color: var(--color-gray-900, #222);
}
.detail-input[readonly] {
  background: var(--color-bg-light, #f8fafc);
  color: var(--color-gray-800, #767676);
}

.top-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

/* 테이블 등은 기존 스타일 일관 유지 */
</style>
