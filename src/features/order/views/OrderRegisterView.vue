<!-- OrderRegisterView.vue -->
<template>
  <RegisterLayout
      title="주문 등록"
      description="납기일을 지정하고 각 제품에 대해 주문하세요."
  >
    <template #actions>
      <button @click="submit">등록</button>
      <button @click="cancel">취소</button>
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
          @searchVendor="openVendorSearch"
      />
    </template>

    <!-- 우측 확장 검색창 -->
    <template #right>
      <OrderRegisterVendorSearch
          v-if="showVendorSearch"
          @select="(val) => {
            console.log('[View] 검색창 보임 - 선택된 거래처:', val)
            handleSelectVendor(val)
          }"
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
import OrderRegisterRight from '../components/OrderRegisterRight.vue'
import OrderRegisterDetail from '../components/OrderRegisterDetail.vue'
import OrderRegisterFooter from '../components/OrderRegisterFooter.vue'

import { dummyOrderRegister } from '@/constants/dummy/orderRegister'
import { computed, reactive, ref } from 'vue'
import OrderRegisterVendorSearch from "@/features/order/components/OrderRegisterVendorSearch.vue";

const form = reactive(dummyOrderRegister)
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
