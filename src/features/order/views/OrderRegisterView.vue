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
import { reactive, ref, onMounted, computed, watch} from 'vue'
import { fetchMyFranchise, fetchOrderDetail, registerOrder, updateOrder } from '@/features/order/api'
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import OrderRegisterLeft from '../components/OrderRegisterLeft.vue'
import OrderRegisterRightPanel from '../components/OrderRegisterRightPanel.vue'
import OrderRegisterDetail from '../components/OrderRegisterDetail.vue'
import RegisterSummaryBox from '@/components/layout/registerview/RegisterSummaryBox.vue'
import OrderRegisterFooter from '../components/OrderRegisterFooter.vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "vue-toastification";

const router = useRouter()
const form = reactive({
  store: {},
  deliveryDate: '',
  items: []
})

const route = useRoute()
const isEditMode = route.query.mode === 'edit'
const orderId = route.query.orderId
const toast = useToast()

// 초기값 세팅 : 신규 등록 및 주문 수정
onMounted(async () => {
  // 가맹점 정보는 항상 조회
  const res = await fetchMyFranchise()
  form.store = res.data.data

  // 수정 모드라면 기존 값 덮어쓰기
  if (isEditMode && orderId) {
    const res = await fetchOrderDetail(orderId)
    // console.log("onMount로 넘어온 데이터: ", res)
    const detail = res.data.data
    form.deliveryDate = detail.orderInfo.deliveryDueDate
    form.items = detail.products.map(p => ({
      productId: p.productId,
      productCode: p.productCode,
      productName: p.productName,
      unit: `${p.unitQuantity}${p.unitSpec}`,
      storeType: p.storageType,
      unitPrice: p.amount,
      quantity: p.quantity
    }))
  }
})

// 우측 패널 상태
const showRightPanel = ref(false)
function openProductSearch() {
  showRightPanel.value = true
}

// 제품 선택 처리
function handleSelectProducts(products) {
  // console.log('[선택된 products]', products)
  const existingIds = new Set(form.items.map(i => i.productId))
  const newItems = products.filter(p => !existingIds.has(p.productId))
      .map(p => {
        return {
          productId: p.productId,
          productCode: p.productCode,
          productName: p.productName,
          unit: p.unit,
          storeType: p.storeType,
          unitPrice: p.basePrice,
          quantity: 1
        }
      })

  // console.log('[추가될 newItems]', newItems)

  form.items.push(...newItems)
  showRightPanel.value = false
}

// 선택한 제품 삭제
function handleRemove(item) {
  const index = form.items.findIndex(i => i.productId === item.productId)
  if (index !== -1) {
    form.items.splice(index, 1)
  }
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
    let res;
    if (isEditMode) {
      res = await updateOrder(orderId, request)
      toast.success("주문이 수정되었습니다.")
      // alert('주문이 수정되었습니다.')
    } else {
      res = await registerOrder(request)
      toast.success("주문이 등록되었습니다.")
      // alert('주문이 등록되었습니다.')
    }

    const newOrderId = res.data.data.orderId;
    await router.push(`/order/${newOrderId}`);
  } catch (e) {
    toast.error(`${isEditMode ? '수정' : '등록'} 실패: ` + (e.response?.data?.message || e.message))
    // alert(`${isEditMode ? '수정' : '등록'} 실패: ` + (e.response?.data?.message || e.message))
  }
}

function cancel() {
  router.push('/orders')
}

watch(() => form.items, (newVal) => {
  // console.log('[현재 선택된 제품 목록]', newVal)
}, { deep: true })
</script>
