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
          <input v-if="isEditing" v-model="product.topCategoryName" class="modal-input" />
          <input v-else type="text" :value="topCategoryName" readonly />
        </div>

        <!-- 카테고리명 -->
        <div class="info-row">
          <label>카테고리명</label>
          <input v-if="isEditing" v-model="product.categoryName" class="modal-input" />
          <input v-else type="text" :value="categoryName" readonly />
        </div>

<!--        <div class="info-row">-->
<!--          <label>상위 카테고리명</label>-->
<!--          <input v-if="isEditing" v-model="product.topCategoryName" class="modal-input" />-->
<!--          <input v-else type="text" :value="product.topCategoryName" readonly />-->
<!--        </div>-->

<!--        &lt;!&ndash; 카테고리명 &ndash;&gt;-->
<!--        <div class="info-row">-->
<!--          <label>카테고리명</label>-->
<!--          <input v-if="isEditing" v-model="product.categoryName" class="modal-input" />-->
<!--          <input v-else type="text" :value="product.categoryName" readonly />-->
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
<!--  </DetailLayout>-->

    <!-- 거래(계약) 테이블 -->
<!--    <template #table>-->
<!--      <ContractTable :contracts="contracts" />-->
<!--    </template>-->
  </DetailLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchProductDetail } from "@/api/productApi";
import { fetchAllTopCategories } from "@/api/categoryApi";
import DetailLayout from "@/components/layout/DetailLayout.vue";
import StatusButton from "@/components/common/StatusButton.vue";
import ContractTable from "@/features/contract/components/ContractTable.vue";
import Pagination from "@/components/common/Pagination.vue";

const route = useRoute();
const productId = route.params.productId;

const topCategories = ref([]);

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

// const loadProductDetail = async () => {
//   try {
//     const res = await fetchProductDetail(productId);
//     const data = res.data.data;
//     product.value = {
//       ...data.product,
//       topCategoryName: data.product.topCategoryName || "",
//       categoryName: data.product.categoryName || "",
//       productCreatedAt: data.product.productCreatedAt || "",
//       productModifiedAt: data.product.productModifiedAt || "",
//     };
//     contracts.value = data.contracts ?? [];
//   } catch (e) {
//     alert("제품 정보를 불러오지 못했습니다.");
//   }
// };

const loadProductDetail = async () => {
  try {
    console.log('productId:', productId); // 여기에 정상적으로 10이 찍히나?
    const res = await fetchProductDetail(productId, page.value, itemsPerPage.value);
    console.log('API 응답:', res.data); // 여기서 위 JSON이 찍히나?
    const data = res.data.data;
    console.log('data:', data);
    product.value = {
      ...data.product,
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
const handleSave = () => {
  // TODO: 저장 API 호출 및 저장 후 isEditing.value = false
  isEditing.value = false;
};
const cancelEdit = () => {
  // TODO: 원복 로직 필요하면 추가
  isEditing.value = false;
};
const handleDelete = () => {
  // TODO: 삭제 로직
  alert("삭제 기능 연결 필요");
};



// categoryId → 카테고리명
// const getCategoryName = (categoryId) => {
//   for (const top of topCategories.value) {
//     const found = (top.categories || []).find(cat => cat.categoryId === categoryId);
//     if (found) return found.categoryName;
//   }
//   return "";
// };

const getCategoryName = (categoryId) => {
  for (const top of topCategories.value) {
    const found = (top.categories || []).find(
        cat => String(cat.categoryId) === String(categoryId)  // <-- 여기!
    );
    if (found) return found.categoryName;
  }
  return "";
};

// categoryId → 상위 카테고리명
// const getTopCategoryName = (categoryId) => {
//   for (const top of topCategories.value) {
//     if ((top.categories || []).find(cat => cat.categoryId === categoryId)) {
//       return top.topCategoryName;
//     }
//   }
//   return "";
// };

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

// onMounted(() => {
//   loadProductDetail();
// });
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
