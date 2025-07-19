<template>
  <ContractLayout
      title="제품에 대한 계약 등록"
      description="제품에 대한 계약 등록을 등록할 수 있습니다."
  >
    <template #basic>
      <div class="contract-register-card">
        <div class="form-grid">
      <div>
        <h2 class="section-title-top">계약 기본 정보 선택</h2>
        <!-- 계약 기본 정보 -->
        <div class="contract-section">

          <div class="contract-box">
            <div class="row">
              <h4 class="section-title">거래처 정보</h4>
            </div>

            <!-- 거래처명 + 검색/자동완성 -->
            <div class="row">
              <label>거래처명</label>
              <div style="position:relative; width:220px;">
                <input
                    v-model="vendorNameInput"
                    @input="searchVendors"
                    @keydown.down="moveVendor(1)"
                    @keydown.up="moveVendor(-1)"
                    @keydown.enter="selectCurrentVendor"
                    @blur="closeVendorSuggestions"
                    placeholder="거래처명을 입력하세요"
                    autocomplete="off"
                    class="input"
                    style="width: 100%;"
                />
                <ul v-if="showVendorSuggestions && filteredVendors.length" class="autocomplete-list">
                  <li
                      v-for="(v, idx) in filteredVendors"
                      :key="v.vendorId"
                      :class="{ 'selected': idx === selectedVendorIdx }"
                      @mousedown.prevent="selectVendor(v)"
                  >
                    {{ v.vendorName }}
                    <span class="sub-info">{{ v.vendorType }}</span>
                  </li>
                </ul>
              </div>
              <button class="section-btn" @click="searchBtnSelectVendor">검색</button>
            </div>
            <div class="row">
              <label>사업자 등록번호</label>
              <input v-model="form.vendorTaxId" class="input" readonly />
              <label>거래처 유형</label>
              <input v-model="form.vendorType" class="input" readonly />
              <label>계약 상태</label>
              <input v-model="form.vendorStatus" class="input" readonly />
            </div>
          </div>

          <!-- 계약 대상 제품 선택 -->
          <div class="contract-box" style="position: relative;">
            <div class="row">
              <h4 class="section-title">제품 정보</h4>
            </div>
            <div class="row">
              <label>제품명</label>
              <div style="position:relative; width:220px;">
                <input
                    v-model="productNameInput"
                    @input="searchProducts"
                    @keydown.down="move(1)"
                    @keydown.up="move(-1)"
                    @keydown.enter="selectCurrent"
                    @blur="closeSuggestions"
                    placeholder="제품명을 입력하세요"
                    autocomplete="off"
                    class="input"
                    style="width: 100%;"
                />
                <!-- 자동완성 리스트 -->
                <ul v-if="showSuggestions && filteredProducts.length" class="autocomplete-list">
                  <li
                      v-for="(p, idx) in filteredProducts"
                      :key="p.productId"
                      :class="{ 'selected': idx === selectedIdx }"
                      @mousedown.prevent="selectProduct(p)"
                  >
                    {{ p.productName }}
                    <span class="sub-info">{{ p.productCode }}</span>
                  </li>
                </ul>
              </div>
              <button class="section-btn" @click="searchBtnSelectProduct">검색</button>
<!--              <button class="section-btn">검색</button>-->
            </div>

            <div class="row">
              <label>상위 카테고리</label>
              <input v-model="form.topCategoryName" class="input" readonly />
              <label>카테고리</label>
              <input v-model="form.subCategoryName" class="input" readonly />
              <label>보관상태</label>
              <input v-model="form.storeType" class="input" readonly />
            </div>
            <div class="row">

              <label>기본 단가</label>
              <input v-model="form.basePrice" class="input" type="number" readonly />
              <label>단위 수량</label>
              <input v-model="form.unitQuantity" class="input" type="number" readonly />
              <label>단위 규격</label>
              <input v-model="form.unitSpec" class="input" readonly />
            </div>
          </div>

        </div>
      </div>

          <h2 class="section-title-top">계약 정보 입력</h2>
        <!-- 계약 정보 입력 -->
        <div class="contract-section">

          <div class="contract-box">
            <div class="row">
              <h4 class="section-title">계약 정보</h4>
              </div>

            <div class="row">
              <label>계약 단가</label>
              <input v-model="form.contractPrice" class="input" type="number" />
              <label>최소 발주 수량</label>
              <input v-model="form.minOrderQty" class="input" type="number" />
              <label>납기일</label>
              <input v-model="form.leadTime" class="input" />
            </div>
            <div class="row">
              <label>계약 시작일</label>
              <FilterDate
                  v-model="form.contractStartDate "
              />
              <label>계약 종료일</label>
              <FilterDate
                  v-model="form.contractEndDate"
                  :min-date="new Date()"
              />
              <span style="flex:2.5"></span>
          </div>
          </div>
        </div>
      </div>
      </div>
    </template>
  </ContractLayout>
  <div class="form-actions">
    <button class="primary" @click="handleSubmit">등록</button>
    <button class="default" @click="goBack">취소</button>
  </div>

  <div>
    <ContractDoneModal
        v-if="doneModalOpen"
        :type="doneModalType"
        @close="() => { doneModalOpen = false; router.push('/contract/list') }"
    />
    <ContractErrorModal
        v-if="ErrorOpen"
        :message="ErrorMsg"
        @close="ErrorOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { createContract } from '@/features/contract/api.js'
import { fetchProducts } from '@/features/product/api.js'
import { fetchCategoryDetail } from '@/features/category/api.js'
import { fetchVendors, fetchVendorContractInfo } from '@/features/vendor/api.js'
import ContractLayout from "@/features/contract/components/ContractLayout.vue";
import FilterDate from '@/components/common/filters/FilterDate.vue'
import ContractDoneModal from "@/features/contract/components/ContractDoneModal.vue";
import ContractErrorModal from "@/features/contract/components/ContractErrorModal.vue";

const router = useRouter()

const form = ref({
  // 거래처 정보
  vendorId: '',
  vendorName: '',
  vendorType: '',
  vendorStatus: '',
  vendorTaxId: '',
  // 제품 정보
  productId: '',
  productName: '',
  categoryName: '',
  topCategoryName: '',
  subCategoryName: '',
  storeType: '',
  basePrice: '',
  unitQuantity: '',
  unitSpec: '',
  // 계약 정보
  contractPrice: '',
  minOrderQty: '',
  leadTime: '',
  contractStartDate: '',
  contractEndDate: '',
  contractStatus: ''
})

// 거래처 자동완성 관련 변수
const vendorNameInput = ref('')
const filteredVendors = ref([])
const showVendorSuggestions = ref(false)
const selectedVendorIdx = ref(-1)

// 자동완성 관련
const productNameInput = ref('')
const filteredProducts = ref([])
const showSuggestions = ref(false)
const selectedIdx = ref(-1)

const doneModalOpen = ref(false)
const doneModalType = ref('register')

const ErrorOpen = ref(false)
const ErrorMsg = ref('')

function showError(msg) {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

// 등록 성공시
const onRegisterSuccess = () => {
  modal.value = { show: true, type: 'register' }
}

// 수정 성공시
const onEditSuccess = () => {
  modal.value = { show: true, type: 'edit' }
}

// 삭제 성공시
const onDeleteSuccess = () => {
  modal.value = { show: true, type: 'delete' }
}

// 거래처 목록 불러오기
const searchVendors = async () => {
  // if (!vendorNameInput.value) {
  //   filteredVendors.value = []
  //   showVendorSuggestions.value = false
  //   return
  // }
  try {
    // (아래 fetchVendors는 반드시 vendor api.js에서 export 해야 함)
    const res = await fetchVendors({
      keyword: vendorNameInput.value,
      size: 10,
      page: 1
    })

    // filteredVendors.value = res.data.data.content

    // 1. 실제 응답 구조에 맞게 방어적으로 할당!
    const content = res?.data?.data?.contents
    filteredVendors.value = Array.isArray(content) ? content : []

    showVendorSuggestions.value = true
    selectedVendorIdx.value = -1
  } catch (e) {
    filteredVendors.value = []
    showVendorSuggestions.value = false
  }
}

// 거래처 선택(자동완성)
const selectVendor = async (v) => {
  form.value.vendorName = v.vendorName
  form.value.vendorId = v.vendorId
  vendorNameInput.value = v.vendorName
  try {
    // 상세 계약 정보 조회
    const res = await fetchVendorContractInfo(v.vendorName)
    form.value.vendorType = res.data.data.vendorType || ''
    form.value.vendorTaxId = res.data.data.vendorTaxId || ''
    form.value.vendorStatus = res.data.data.vendorStatus || ''
  } catch (e) {
    form.value.vendorType = ''
    form.value.vendorTaxId = ''
    form.value.vendorStatus = ''
  }
  showVendorSuggestions.value = false
}
// const searchBtnSelectVendor = () => {
//   if (filteredVendors.value.length) {
//     selectVendor(filteredVendors.value[0])
//   }
// }

const searchBtnSelectVendor = async () => {
  await searchVendors();
  showVendorSuggestions.value = true;
  selectedVendorIdx.value = filteredVendors.value.length > 0 ? 0 : -1;
};

const searchBtnSelectProduct = async () => {
  await searchProducts();
  showSuggestions.value = true;
  selectedIdx.value = filteredProducts.value.length > 0 ? 0 : -1;
};

const moveVendor = (dir) => {
  if (!showVendorSuggestions.value || !filteredVendors.value.length) return
  let next = selectedVendorIdx.value + dir
  if (next < 0) next = filteredVendors.value.length - 1
  if (next >= filteredVendors.value.length) next = 0
  selectedVendorIdx.value = next
}
const selectCurrentVendor = () => {
  if (selectedVendorIdx.value >= 0) {
    selectVendor(filteredVendors.value[selectedVendorIdx.value])
  }
}
const closeVendorSuggestions = () => {
  setTimeout(() => showVendorSuggestions.value = false, 100)
}

const searchProducts = async () => {
  // if (!productNameInput.value) {
  //   filteredProducts.value = []
  //   showSuggestions.value = false
  //   return
  // }
  try {
    const res = await fetchProducts({
        productName: productNameInput.value,
        size: 10,
        productStatusFilter: 'ACTIVE_ONLY'
    })
    filteredProducts.value = res.data.data.products
    showSuggestions.value = true
    selectedIdx.value = -1
  } catch (e) {
    filteredProducts.value = []
    showSuggestions.value = false
  }
}

// 자동완성에서 항목 클릭/엔터 선택 시
const selectProduct = async (p) => {
  // 제품 정보 채우기
  form.value.productId = p.productId
  form.value.productName = p.productName
  productNameInput.value = p.productName
  form.value.basePrice = p.basePrice
  form.value.unitQuantity = p.unitQuantity
  form.value.unitSpec = p.unitSpec
  form.value.storeType = p.storeType

  // 카테고리 정보 추가 조회
  if (p.categoryId) {
    try {
      const res = await fetchCategoryDetail(p.categoryId)
      form.value.categoryName = res.data.data.categoryMeta.categoryName || ''
      form.value.topCategoryName = res.data.data.topCategory.topCategoryName || ''
    } catch (e) {
      form.value.categoryName = ''
      form.value.topCategoryName = ''
    }
  } else {
    form.value.categoryName = ''
    form.value.topCategoryName = ''
  }
  // 하위 카테고리명은 따로 없다면 categoryName만 사용
  form.value.subCategoryName = form.value.categoryName
  showSuggestions.value = false
}

// 키보드 위/아래/엔터 지원
const move = (dir) => {
  if (!showSuggestions.value || !filteredProducts.value.length) return
  let next = selectedIdx.value + dir
  if (next < 0) next = filteredProducts.value.length - 1
  if (next >= filteredProducts.value.length) next = 0
  selectedIdx.value = next
}
const selectCurrent = () => {
  if (selectedIdx.value >= 0) {
    selectProduct(filteredProducts.value[selectedIdx.value])
  }
}
const closeSuggestions = () => {
  setTimeout(() => showSuggestions.value = false, 100)
}

const handleSubmit = async () => {
  const today = new Date();
  const startDate = form.value.contractStartDate ? new Date(form.value.contractStartDate) : null;
  const endDate = form.value.contractEndDate ? new Date(form.value.contractEndDate) : null;

  if (startDate && endDate) {
    // 종료일 이후면 EXPIRED, 나머지는 모두 ACTIVE
    if (today > endDate) {
      form.value.contractStatus = "EXPIRED";
    } else {
      form.value.contractStatus = "ACTIVE";
    }
  } else {
    form.value.contractStatus = ""; // 날짜 누락시 빈값
  }

  try {
    await createContract(form.value);
    doneModalType.value = 'register'
    doneModalOpen.value = true
  } catch (e) {
    showError('계약 등록에 실패했습니다.\n' + (e?.response?.data?.message ?? e.message))
  }
};

const goBack = () => {
  router.push('/contract/list')
}
</script>

<style scoped>
.form-grid {

  width: 100%;
}
.contract-section {
  gap: 2rem;
  transition: all 0.3s ease;
  background-color: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  padding: 3rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  margin: 56px auto 0 auto;
  width: 100%;
}
.section-title-top {
  font-size: var(--font-page-title-small);
  font-weight: bold;
  color: var(--color-gray-700);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.75rem;
  margin-bottom: 2rem;
  margin-top: 5rem;
}
.section-title {
  font-size: var(--font-page-title-small);
  font-weight: bold;
  color: var(--color-gray-700);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.75rem;
  margin-top: 0.7rem;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  gap: 40px;
  flex-wrap: wrap;

}
.section-btn {
  background: #59a6ce;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 20px;
  margin-right: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}
.input {
  padding: 0.5rem 0.75rem;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-info-value);
  color: var(--color-gray-900);
  min-height: 2.2rem;
  display: flex
;
  align-items: center;
}
label {
  font-weight: 500;
  min-width: 80px;
  color: #26435c;
  margin-right: 5px;
}
.autocomplete-list {
  position: absolute;
  top: 37px;
  left: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid #c4c4c4;
  border-radius: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  width: 220px;
}
.autocomplete-list li {
  padding: 7px 12px;
  cursor: pointer;
}
.autocomplete-list li.selected {
  background: #d2e8ff;
  font-weight: 600;
}
.sub-info {
  color: #888;
  font-size: 12px;
  margin-left: 12px;
}

.input[type="number"]::-webkit-outer-spin-button,
.input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input[type="number"] {
  -moz-appearance: textfield;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
}

.form-actions button.primary {
  padding: 6px 16px;
  font-size: var(--font-button);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
  background-color: var(--color-primary);
  color: white;
}

.form-actions button.default {
  padding: 6px 16px;
  font-size: var(--font-button);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #d1d5db;
  white-space: nowrap;
  background-color: var(--color-gray-200);
  color: #000000;
}


</style>
