<template>
  <RegisterLayout title="주문 등록" description="납기일을 지정하고 각 제품에 대해 주문하세요.">

    <!-- 좌측: 가맹점 정보 + 납기일 입력 -->
    <template #left>
      <OrderRegisterLeft
          :store="form.store"
          :deliveryDate="form.deliveryDate"
          @update:deliveryDate="val => form.deliveryDate = val"
      />
    </template>

    <!-- 우측 패널: 제품 선택 -->
    <template #right v-if="showRightPanel">
      <OrderRegisterRightPanel
          type="product"
          multi
          @select="handleSelectProducts"
          @close="showRightPanel = false"
      />
    </template>

    <!-- 상세: 선택된 제품 목록 -->
    <template #detail>
      <OrderRegisterDetail
          :items="form.items"
          @remove="handleRemove"
          @update-item="handleUpdateItem"
          @add-product="openProductSearch"
      />
    </template>

    <!-- 요약: 총 수량/금액 -->
    <template #summary>
      <RegisterSummaryBox
          :total-items="totalItems"
          :total-quantity="totalQuantity"
          :total-amount="totalAmount"
      />
    </template>

    <!-- 하단 등록 버튼 -->
    <template #footer>
      <OrderRegisterFooter @submit="submit" @cancel="cancel" />
    </template>
  </RegisterLayout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { fetchMyFranchise, fetchProducts, registerOrder } from '@/features/order/api'
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import OrderRegisterLeft from '../components/OrderRegisterLeft.vue'
import OrderRegisterRightPanel from '../components/OrderRegisterRightPanel.vue'
import OrderRegisterDetail from '../components/OrderRegisterDetail.vue'
import RegisterSummaryBox from '@/components/layout/registerview/RegisterSummaryBox.vue'
import OrderRegisterFooter from '../components/OrderRegisterFooter.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  store: {},
  deliveryDate: '',
  items: []
})

// 가맹점 정보 조회
onMounted(async () => {
  try {
    const res = await fetchMyFranchise()
    console.log('[가맹점 정보 응답]', res)
    form.store = res.data.data
  } catch (e) {
    console.error('가맹점 정보 조회 실패:', e)
  }
})

// 우측 패널 상태
const showRightPanel = ref(false)
function openProductSearch() {
  showRightPanel.value = true
}

// 제품 선택 처리
function handleSelectProducts(products) {
  const existingIds = new Set(form.items.map(i => i.productId))
  const newItems = products.filter(p => !existingIds.has(p.productId))
      .map(p => ({
        productId: p.productId,
        productCode: p.productCode,
        productName: p.productName,
        unit: `${p.unitQuantity}${p.unitSpec}`,
        storeType: p.storeType,
        unitPrice: p.basePrice,
        quantity: 1
      }))
  form.items.push(...newItems)
  showRightPanel.value = false
}

// 항목 제거
function handleRemove(itemToRemove) {
  form.items = form.items.filter(i => i.productId !== itemToRemove.productId)
}

// 수량 변경
function handleUpdateItem(index, field, value) {
  form.items[index][field] = value
}

// 총계 계산
const totalItems = computed(() => form.items.length)
const totalQuantity = computed(() => form.items.reduce((acc, i) => acc + i.quantity, 0))
const totalAmount = computed(() => form.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0))

// 제출
async function submit() {
  const request = {
    deliveryDueDate: form.deliveryDate,
    orderDetails: form.items.map(i => ({
      productId: i.productId,
      quantity: i.quantity
    }))
  }
  try {
    await registerOrder(request)
    alert('주문이 등록되었습니다.')
    router.push('/orders')
  } catch (e) {
    alert('등록 실패: ' + e.message)
  }
}

function cancel() {
  router.push('/orders')
}
</script>
