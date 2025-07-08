<!-- OrderRegisterView.vue -->
<template>
  <RegisterLayout
      title="주문 등록"
      description="납기일을 지정하고 각 제품에 대해 주문하세요."
  >
    <template #actions>
      <StatusButton type="primary" @click="submit">등록</StatusButton>
      <StatusButton type="reset" @click="cancel">취소</StatusButton>
    </template>

    <template #left>
      <OrderRegisterLeft
          v-model:approver="form.approver"
          v-model:vendor="form.vendor"
          v-model:warehouse="form.warehouse"
          v-model:deliveryDate="form.deliveryDate"
          v-model:orderCategory="form.orderCategory"
          v-model:memo="form.memo"
          v-model:address="form.address"
          v-model:attachments="form.attachments"
          :store="form.store"
          :orderType="form.orderType"
          @searchVendor="() => openSearch('vendor')"
          @searchApprover="() => openSearch('approver')"
          @searchWarehouse="() => openSearch('warehouse')"
      />
    </template>

    <!-- 우측 확장 검색창 -->
    <template #right v-if="showRightPanel">
      <OrderRegisterRightPanel
          :type="searchType"
          :multi="searchType === 'vendor'"
          @select="handleSelect"
          @close="showRightPanel = false"
      />
    </template>


    <!-- 제품 상세 테이블 -->
    <template #detail>
      <OrderRegisterDetail
          :items="form.items"
          @remove="handleRemove"
          @add-product="handleAddProduct"
      />
    </template>

    <!-- 총합 요약 -->
    <template #summary>
      <RegisterSummaryBox
          :total-items="totalItems"
          :total-quantity="totalQuantity"
          :total-amount="totalAmount"
      />
    </template>

    <!-- 하단 버튼 -->
    <template #footer>
      <OrderRegisterFooter />
    </template>
  </RegisterLayout>
</template>

<script setup>
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import RegisterSummaryBox from '@/components/layout/registerview/RegisterSummaryBox.vue'

import OrderRegisterLeft from '../components/OrderRegisterLeft.vue'
import OrderRegisterRightPanel from '../components/OrderRegisterRightPanel.vue'
import OrderRegisterDetail from '../components/OrderRegisterDetail.vue'
import OrderRegisterFooter from '../components/OrderRegisterFooter.vue'

import { dummyOrderRegister } from '@/constants/dummy/orderRegister'
import { computed, reactive, ref } from 'vue'
import OrderRegisterVendorSearch from "@/features/order/components/OrderRegisterVendorSearch.vue";
import StatusButton from "@/components/common/StatusButton.vue";

const form = reactive({
  ...dummyOrderRegister,
  vendorList: [] // 다중선택
})


const showRightPanel = ref(false)
const searchType = ref(null) // 'vendor' | 'approver' | 'warehouse'

function openSearch(type) {
  searchType.value = type
  showRightPanel.value = true
}

function handleSelect(payload) {
  if (Array.isArray(payload)) {
    // 다중 선택
    form.vendorList = payload  // 예시: form 안에 vendorList로 담음
    console.log('다중 선택된 벤더:', payload)
  } else {
    // 단일 선택
    switch (searchType.value) {
      case 'vendor':
        Object.assign(form.vendor, payload)
        break
      case 'approver':
        Object.assign(form.approver, payload)
        break
      case 'warehouse':
        Object.assign(form.warehouse, payload)
        break
    }
    showRightPanel.value = false // ✅ 단일일 때만 닫기
  }
}


const showVendorSearch = ref(false)

// 거래처 선택에 대한 모달 검색 창
function openVendorSearch() {
  console.log('[View] 거래처 검색창 열림 시도')
  showVendorSearch.value = true
}


function handleSelectVendor(selectedVendor) {
  form.vendor = selectedVendor
  showVendorSearch.value = false
}

const totalItems = computed(() => form.items.length)
const totalQuantity = computed(() =>
    form.items.reduce((sum, item) => sum + item.quantity, 0)
)
const totalAmount = computed(() =>
    form.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
)

function handleRemove(index) {
  form.items.splice(index, 1)
}

function handleAddProduct() {
  // 제품 추가 모달 또는 로직
  alert('제품 추가 기능 미구현')
}
</script>
