<!--
<script setup>
import { ref } from 'vue'
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import RequisitionRegisterLeft from '../components/Register/RequisitionRegisterLeft.vue'
import RequisitionRegisterOrderInfo from '../components/Register/RequisitionRegisterOrderInfo.vue'
import RequisitionRegisterRightPanel from '../components/Register/RequisitionRegisterRightPanel.vue'
import RequisitionRegisterDetail from '../components/Register/RequisitionRegisterDetail.vue'
import RequisitionRegisterFooter from '../components/Register/RequisitionRegisterFooter.vue'
import {useAuthStore} from "@/features/auth/useAuthStore.js";

const authStore = useAuthStore()
const authority = authStore.authority
// const email = authStore.email


// 요청자 정보 (userStore의 email을 이용해 백엔드에서 조회 예정)
const requester = ref({
  name: '',
  position: '',
  phone: '',
  email: authStore.email || ''
})

// 결재자 정보
const approver = ref({
  memberId: null,
  name: '',
  position: '',
  phone: ''
})

// 품의 기본 정보
const orderInfo = ref({
  vendorId: null,
  vendorName: '',
  warehouseId: null,
  warehouseName: '',
  dueDate: ''
})

// 거래처 제품 목록 (선택된 vendor 기준)
const vendorProducts = ref([])

// 선택된 품의 상세 항목
const requisitionItems = ref([])

// 상품 추가
const addProduct = (product) => {
  requisitionItems.value.push(product)
}

// 상품 삭제
const removeProduct = (index) => {
  requisitionItems.value.splice(index, 1)
}

// 저장 버튼 클릭 시
const handleSubmit = () => {
  const payload = {
    vendorId: orderInfo.value.vendorId,
    warehouseId: orderInfo.value.warehouseId,
    approvedMemberId: approver.value.memberId,
    dueDate: orderInfo.value.dueDate,
    items: requisitionItems.value.map(item => ({
      contractId: item.contractId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  }

  console.log('품의 등록 payload:', payload)
  // TODO: API 호출
}
</script>

<template>
  <RegisterLayout>
    <div class="register-container">
      &lt;!&ndash; 왼쪽 섹션 &ndash;&gt;
      <RequisitionRegisterLeft
          :requester="requester"
          :approver="approver"
          @selectApprover="(data) => approver.value = data"
      />

      &lt;!&ndash; 중앙 섹션 &ndash;&gt;
      <div class="order-info-section">
        <RequisitionRegisterOrderInfo
            v-model:orderInfo="orderInfo"
        />
        <RequisitionRegisterDetail
            :items="requisitionItems"
            @removeItem="removeProduct"
        />
      </div>

      &lt;!&ndash; 오른쪽 섹션 &ndash;&gt;
      <RequisitionRegisterRightPanel
          :vendorId="orderInfo.vendorId"
          :vendorProducts="vendorProducts"
          @addProduct="addProduct"
      />
    </div>

    &lt;!&ndash; 하단 저장/취소 &ndash;&gt;
    <RequisitionRegisterFooter @submit="handleSubmit" />
  </RegisterLayout>
</template>
-->
<script setup>
import { ref } from 'vue'
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import RequisitionRegisterLeft from '../components/Register/RequisitionRegisterLeft.vue'
import RequisitionRegisterOrderInfo from '../components/Register/RequisitionRegisterOrderInfo.vue'
import RequisitionRegisterRightPanel from '../components/Register/RequisitionRegisterRightPanel.vue'
import RequisitionRegisterDetail from '../components/Register/RequisitionRegisterDetail.vue'
import RequisitionRegisterFooter from '../components/Register/RequisitionRegisterFooter.vue'
import { useAuthStore } from '@/features/auth/useAuthStore.js'

const authStore = useAuthStore()
const authority = authStore.authority

// 요청자 정보 (userStore의 email을 이용해 백엔드에서 조회 예정)
const requester = ref({
  name: '',
  position: '',
  phone: '',
  email: authStore.email || ''
})

// 결재자 정보 (SENIOR_MANAGER만 검색 가능)
const approver = ref({
  memberId: null,
  name: '',
  position: '',
  phone: ''
})

// 품의 기본 정보 (거래처, 창고, 납기일)
const orderInfo = ref({
  vendorId: null,
  vendorName: '',
  warehouseId: null,
  warehouseName: '',
  dueDate: ''
})

// 거래처 상품 목록 (GET /api/contracts?vendorId=...)
const vendorProducts = ref([])

// 품의 상세 항목 리스트
const requisitionItems = ref([])

// 상품 추가 핸들러
const addProduct = (product) => {
  requisitionItems.value.push(product)
}

// 상품 삭제 핸들러
const removeProduct = (index) => {
  requisitionItems.value.splice(index, 1)
}

// 저장 버튼 클릭 시 호출
const handleSubmit = () => {
  const payload = {
    vendorId: orderInfo.value.vendorId,
    warehouseId: orderInfo.value.warehouseId,
    approvedMemberId: approver.value.memberId,
    dueDate: orderInfo.value.dueDate,
    items: requisitionItems.value.map(item => ({
      contractId: item.contractId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  }

  console.log('품의 등록 payload:', payload)
  // TODO: 실제 API 호출 연동 예정
}
</script>

<template>
  <RegisterLayout>
    <div class="register-container">
      <!-- 왼쪽: 요청자 / 결재자 정보 -->
      <RequisitionRegisterLeft
          :requester="requester"
          :approver="approver"
          @selectApprover="(data) => approver.value = data"
      />

      <!-- 중앙: 거래처/창고/납기일 + 품의 상세 -->
      <div class="order-info-section">
        <RequisitionRegisterOrderInfo
            v-model:orderInfo="orderInfo"
        />
        <RequisitionRegisterDetail
            :items="requisitionItems"
            @removeItem="removeProduct"
        />
      </div>

      <!-- 오른쪽: 거래처 제품 선택 -->
      <RequisitionRegisterRightPanel
          :vendorId="orderInfo.vendorId"
          :vendorProducts="vendorProducts"
          @addProduct="addProduct"
      />
    </div>

    <!-- 하단: 저장/취소 버튼 -->
    <RequisitionRegisterFooter
        @submit="handleSubmit"
    />
  </RegisterLayout>
</template>
