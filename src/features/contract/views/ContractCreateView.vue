<template>
  <DetailLayout
      title="제품에 대한 계약 등록"
      description="제품에 대한 계약 등록을 등록할 수 있습니다."
  >
    <!-- 상단 버튼: actions slot -->
    <template #actions>
      <StatusButton type="primary" @click="handleSubmit">등록</StatusButton>
      <StatusButton type="default" @click="handleCancel">취소</StatusButton>
    </template>

    <!-- 본문 폼: basic slot (꼭 div로 래핑!) -->
    <template #basic>
      <div>
        <!-- 계약 기본 정보 선택 -->
        <div class="contract-section">
          <h2 class="section-title">계약 기본 정보 선택</h2>
          <div class="contract-box">
            <div class="row">
              <button class="section-btn">거래처 정보</button>
              <button class="section-btn">검색</button>
            </div>
            <div class="row">
              <label>거래처명</label>
              <input v-model="form.vendorName" class="input" />
              <label>거래처 유형</label>
              <input v-model="form.vendorType" class="input" />
              <label>계약 상태</label>
              <input v-model="form.contractStatus" class="input" />
            </div>
            <div class="row">
              <label>사업자 등록번호</label>
              <input v-model="form.businessNumber" class="input" />
            </div>
          </div>
        </div>

        <!-- 계약 대상 제품 선택 -->
        <div class="contract-section">
          <h2 class="section-title">계약 대상 제품 선택</h2>
          <div class="contract-box">
            <div class="row">
              <button class="section-btn">제품 정보</button>
              <button class="section-btn">검색</button>
            </div>
            <div class="row">
              <label>제품명</label>
              <input v-model="form.productName" class="input" />
              <label>카테고리</label>
              <input v-model="form.categoryName" class="input" />
              <label>상위 카테고리</label>
              <input v-model="form.topCategoryName" class="input" />
              <label>하위 카테고리</label>
              <input v-model="form.subCategoryName" class="input" />
              <label>보관상태</label>
              <input v-model="form.storeType" class="input" />
            </div>
            <div class="row">
              <label>기본 단가</label>
              <input v-model="form.basePrice" class="input" type="number" />
              <label>단위 수량</label>
              <input v-model="form.unitQuantity" class="input" type="number" />
              <label>단위 규격</label>
              <input v-model="form.unitSpec" class="input" />
            </div>
          </div>
        </div>

        <!-- 계약 정보 입력 -->
        <div class="contract-section">
          <h2 class="section-title">계약 정보 입력</h2>
          <div class="contract-box">
            <div class="row">
              <label>계약 단가</label>
              <input v-model="form.contractPrice" class="input" type="number" />
              <label>MOQ</label>
              <input v-model="form.minOrderQty" class="input" type="number" />
              <label>납기일</label>
              <input v-model="form.leadTime" class="input" />
            </div>
            <div class="row">
              <label>계약 시작일</label>
              <input v-model="form.contractStartDate" class="input" type="date" />
              <label>계약 종료일</label>
              <input v-model="form.contractEndDate" class="input" type="date" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </DetailLayout>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import { createContract } from '@/features/contract/api.js'

const router = useRouter()

const form = ref({
  // 거래처 정보
  vendorName: '',
  vendorType: '',
  contractStatus: '',
  businessNumber: '',
  // 제품 정보
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
  contractEndDate: ''
})

const handleSubmit = async () => {
  try {
    await createContract(form.value)
    alert('계약이 등록되었습니다.')
    router.push('/contract/list')
  } catch (e) {
    alert('계약 등록에 실패했습니다.')
  }
}
const handleCancel = () => {
  router.push('/contract/list')
}
</script>

<style scoped>
.contract-section {
  margin-top: 24px;
}
.section-title {
  font-size: 19px;
  font-weight: bold;
  margin-bottom: 14px;
}
.contract-box {
  background: #e9edf1;
  border-radius: 12px;
  padding: 26px 32px 18px 32px;
  margin-bottom: 8px;
}
.row {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  gap: 14px;
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
  background: #fff;
  border: 1px solid #bfc7d3;
  border-radius: 7px;
  padding: 7px 12px;
  min-width: 110px;
  font-size: 15px;
}
label {
  font-weight: 500;
  min-width: 80px;
  color: #26435c;
  margin-right: 5px;
}
</style>
