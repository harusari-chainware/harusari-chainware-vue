<template>
  <DetailLayout
      title="제품 상세 조회"
      description="제품의 상세 정보를 확인할 수 있습니다."
  >
    <!-- 상단 버튼 -->
    <template #actions>
      <template v-if="!isEditing">
        <StatusButton type="primary" @click="startEdit">수정</StatusButton>
        <StatusButton type="danger" @click="handleDelete">삭제</StatusButton>
      </template>
      <template v-else>
        <StatusButton type="primary" @click="handleSave">저장</StatusButton>
        <StatusButton type="default" @click="cancelEdit">취소</StatusButton>
      </template>
    </template>

    <template #basic>
      <div class="info-group">
        <!-- 제품명 -->
        <div class="info-row">
          <label>제품명</label>
          <input v-if="isEditing" v-model="product.productName" class="modal-input" />
          <input v-else type="text" :value="product.productName" readonly />
        </div>

        <!-- 제품코드 -->
        <div class="info-row">
          <label>제품코드</label>
          <input v-if="isEditing" v-model="product.productCode" class="modal-input" />
          <input v-else type="text" :value="product.productCode" readonly />
        </div>

        <!-- 상위 카테고리명 -->
        <div class="info-row">
          <label>상위 카테고리명</label>
          <input type="text" :value="topCategoryName" readonly />
        </div>

        <!-- 카테고리명 -->
        <div class="info-row">
          <label>카테고리명</label>
          <input type="text" :value="categoryName" readonly />
        </div>

        <!-- 상위 카테고리명 -->
        <!--        <div class="info-row">-->
        <!--          <label>상위 카테고리명</label>-->
        <!--          <input v-if="isEditing" v-model="product.topCategoryName" class="modal-input" />-->
        <!--          <input v-else type="text" :value="topCategoryName" readonly />-->
        <!--        </div>-->
        <!-- 상위 카테고리 -->
<!--        <div class="info-row">-->
<!--          <label>상위 카테고리명</label>-->
<!--          <select v-if="isEditing" v-model="product.topCategoryId" class="modal-input">-->
<!--            <option v-for="top in topCategories" :key="top.topCategoryId" :value="top.topCategoryId">-->
<!--              {{ top.topCategoryName }}-->
<!--            </option>-->
<!--          </select>-->
<!--          <input v-else type="text" :value="topCategoryName" readonly />-->
<!--        </div>-->

        <!-- 카테고리명 -->
        <!--        <div class="info-row">-->
        <!--          <label>카테고리명</label>-->
        <!--          <input v-if="isEditing" v-model="product.categoryName" class="modal-input" />-->
        <!--          <input v-else type="text" :value="categoryName" readonly />-->
        <!--        </div>-->
<!--        <div class="info-row">-->
<!--          <label>카테고리명</label>-->
<!--          <select v-if="isEditing" v-model="product.categoryId" class="modal-input">-->
<!--            <option v-for="cat in getCategoryList(product.topCategoryId)" :key="cat.categoryId" :value="cat.categoryId">-->
<!--              {{ cat.categoryName }}-->
<!--            </option>-->
<!--          </select>-->
<!--          <input v-else type="text" :value="categoryName" readonly />-->
<!--        </div>-->

        <!-- 단가 -->
        <div class="info-row">
          <label>단가</label>
          <input v-if="isEditing" v-model="product.basePrice" class="modal-input" />
          <input v-else type="text" :value="product.basePrice" readonly />
        </div>

        <!-- 안전 재고 수량 -->
        <div class="info-row">
          <label>안전 재고 수량</label>
          <input type="text" v-model="product.safetyStock" :readonly="!isEditing" />
        </div>

        <!-- 원산지 -->
        <div class="info-row">
          <label>원산지</label>
          <input type="text" v-model="product.origin" :readonly="!isEditing" />
        </div>

        <!-- 제품 단위 -->
        <div class="info-row">
          <label>제품 단위</label>
          <input type="text" v-model="product.unitQuantity" :readonly="!isEditing" />
        </div>

        <!-- 규격 -->
        <div class="info-row">
          <label>규격</label>
          <input type="text" v-model="product.unitSpec" :readonly="!isEditing" />
        </div>

        <!-- 보관상태 -->
        <div class="info-row">
          <label>보관상태</label>
          <input type="text" v-model="product.storeType" :readonly="!isEditing" />
        </div>

        <!-- 유통기한 -->
        <div class="info-row">
          <label>유통기한</label>
          <input type="text" v-model="product.shelfLife" :readonly="!isEditing" />
        </div>

        <!-- 등록일시, 수정일시 -->
        <div class="info-row">
          <label>등록 일시</label>
          <input type="text" :value="product.productCreatedAt" disabled />
        </div>
        <div class="info-row">
          <label>수정 일시</label>
          <input type="text" :value="product.productModifiedAt" disabled />
        </div>
      </div>
    </template>

    <!-- 거래처 테이블 -->
    <template #detail>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>거래처 ID</th>
            <th>거래처명</th>
            <th>계약 단가</th>
            <th>최소 발주 수량</th>
            <th>납기일</th>
            <th>계약 상태</th>
            <th>계약 시작일</th>
            <th>계약 종료일</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="contract in contracts" :key="contract.contractId">
            <td>{{ contract.vendorId }}</td>
            <td>{{ contract.vendorName }}</td>
            <td>{{ contract.contractPrice }}</td>
            <td>{{ contract.minOrderQty }}</td>
            <td>{{ contract.leadTime }}</td>
            <td>{{ contract.contractStatus }}</td>
            <td>{{ contract.contractStartDate }}</td>
            <td>{{ contract.contractEndDate }}</td>
          </tr>
          <tr v-if="contracts.length === 0">
            <td colspan="8">연결된 거래처가 없습니다.</td>
          </tr>
          </tbody>
        </table>
        <Pagination
            v-model="page"
            :total-items="pagination.totalItems"
            :items-per-page="itemsPerPage"
            @update:modelValue="loadProductDetail"
        />
      </div>
    </template>
  </DetailLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchProductDetail, updateProduct, deleteProduct  } from "@/api/productApi";
import { fetchAllTopCategories } from "@/api/categoryApi";
import DetailLayout from "@/components/layout/DetailLayout.vue";
import StatusButton from "@/components/common/StatusButton.vue";
import Pagination from "@/components/common/Pagination.vue";

const route = useRoute();
const productId = route.params.productId;

const topCategories = ref([]);

const isDeleting = ref(false);

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
})

const page = ref(1);
const itemsPerPage = ref(10);

const product = ref({});
const contracts = ref([]);
const isEditing = ref(false);

const categoryName = computed(() =>
    getCategoryName(product.value.categoryId)
);
const topCategoryName = computed(() =>
    getTopCategoryName(product.value.categoryId)
);

const getCategoryList = (topCategoryId) => {
  const top = topCategories.value.find(tc => tc.topCategoryId === topCategoryId);
  return top ? top.categories : [];
};

const loadProductDetail = async () => {
  try {
    console.log('productId:', productId); // 여기에 정상적으로 10이 찍히나?
    const res = await fetchProductDetail(productId, page.value, itemsPerPage.value);
    console.log('API 응답:', res.data); // 여기서 위 JSON이 찍히나?
    const data = res.data.data;
    console.log('data:', data);
    product.value = {
      ...data.product,
      topCategoryId: findTopCategoryIdByCategoryId(data.product.categoryId),
      topCategoryName: data.product.topCategoryName || (data.contracts?.[0]?.topCategoryName || ""),
      categoryName: data.product.categoryName || (data.contracts?.[0]?.categoryName || ""),
      productCreatedAt: data.product.productCreatedAt || "",
      productModifiedAt: data.product.productModifiedAt || "",
    };
    contracts.value = data.contracts ?? [];

    console.log('product.value.categoryId:', product.value.categoryId);
    console.log('topCategories:', topCategories.value);
    console.log('categoryName:', categoryName.value);
    console.log('topCategoryName:', topCategoryName.value);

  } catch (e) {
    console.error('제품 정보를 불러오지 못했습니다:', e);
  }
};


const startEdit = () => {
  isEditing.value = true;
};

const handleSave = async () => {
  try {
    // 저장할 값 준비 (product.value를 그대로 써도 됨)
    const payload = {
      ...product.value,
      // 필요시, 추가/제외할 필드 조정!
      productId: product.value.productId,
      productName: product.value.productName,
      productCode: product.value.productCode,
      categoryId: product.value.categoryId,
      topCategoryId: product.value.topCategoryId,
      basePrice: product.value.basePrice,
      safetyStock: product.value.safetyStock,
      origin: product.value.origin,
      unitQuantity: product.value.unitQuantity,
      unitSpec: product.value.unitSpec,
      storeType: product.value.storeType,
      shelfLife: product.value.shelfLife,
    };

    // 1. 실제 저장(수정) API 호출
    await updateProduct(product.value.productId, payload);

    // 2. 저장 후 상세정보 재조회
    await loadProductDetail();

    isEditing.value = false;
    alert("저장되었습니다.");
  } catch (e) {
    alert("저장 실패: " + (e?.response?.data?.message || e.message));
  }
};


const handleDelete = async () => {
  if (isDeleting.value) return; // 중복 방지

  if (!confirm("정말로 이 제품을 삭제하시겠습니까?")) {
    return;
  }

  isDeleting.value = true; // 실제 삭제 시작 전에 true

  try {
    await deleteProduct(product.value.productId);

    alert("삭제되었습니다.");
    window.history.back();
  } catch (e) {
    alert("삭제 실패: " + (e?.response?.data?.message || e.message));
  } finally {
    isDeleting.value = false; // 항상 복구!
  }
};


const cancelEdit = () => {
  // TODO: 원복 로직 필요하면 추가
  isEditing.value = false;
};


const getCategoryName = (categoryId) => {
  for (const top of topCategories.value) {
    const found = (top.categories || []).find(
        cat => String(cat.categoryId) === String(categoryId)  // <-- 여기!
    );
    if (found) return found.categoryName;
  }
  return "";
};

const getTopCategoryName = (categoryId) => {
  for (const top of topCategories.value) {
    if ((top.categories || []).find(
        cat => String(cat.categoryId) === String(categoryId)  // <-- 여기!
    )) {
      return top.topCategoryName;
    }
  }
  return "";
};

function findTopCategoryIdByCategoryId(categoryId) {
  for (const top of topCategories.value) {
    if ((top.categories || []).find(cat => String(cat.categoryId) === String(categoryId))) {
      return top.topCategoryId;
    }
  }
  return null;
}

onMounted(async () => {
  const res = await fetchAllTopCategories();
  console.log('API 응답:', res.data.data.topCategories);
  topCategories.value = res.data.data.topCategories ?? [];
  await loadProductDetail();

  console.log('product.value.categoryId:', product.value.categoryId);
  console.log('topCategories:', topCategories.value);
  console.log('categoryName:', categoryName.value);
  console.log('topCategoryName:', topCategoryName.value);
});

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