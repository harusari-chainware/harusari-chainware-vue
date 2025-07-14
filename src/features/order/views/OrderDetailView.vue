<template>
  <DetailLayout
      v-if="!!orderData.orderInfo?.orderCode"
      title="주문 상세"
      description="주문의 기본 정보와 상세 내용을 확인할 수 있습니다."
  >
    <!-- 상단 버튼 영역 -->
    <template #actions>
      <StatusButton v-if="canEdit" type="primary" @click="handleEdit">수정</StatusButton>
      <StatusButton v-if="canCancel" type="danger" @click="openCancelModal">취소</StatusButton>
      <StatusButton v-if="canApprove" type="approve" @click="openApproveModal">승인</StatusButton>
      <StatusButton v-if="canReject" type="reject" @click="openRejectModal">반려</StatusButton>
      <StatusButton v-if="canReturn" type="return" @click="goToTakeback">반품하기</StatusButton>
    </template>

    <!-- 기본 정보 영역 -->
    <template #basic>
      <OrderDetailBasic
          v-if="orderData.orderInfo && orderData.franchiseOwnerInfo"
          :orderInfo="orderData.orderInfo"
          :franchiseOwnerInfo="orderData.franchiseOwnerInfo"
          :deliveryHistory="orderData.deliveryHistory || []"
          :rejectReason="orderData.rejectReason || ''"
      />
    </template>

    <!-- 상세 제품 테이블 -->
    <template #detail>
      <OrderDetailDetail :items="orderData.products || []" />
    </template>
  </DetailLayout>
</template>

<script setup>
import {ref, onMounted, reactive, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/useAuthStore.js'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import OrderDetailBasic from '../components/OrderDetailBasic.vue'
import OrderDetailDetail from '../components/OrderDetailDetail.vue'
import { fetchOrderDetail } from '../api.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const orderId = route.params.orderId

const userRole = computed(() => authStore.authority)
console.log('userRole: ', userRole.value)

const orderData = reactive({
  orderInfo: {},
  franchiseOwnerInfo: {},
  deliveryHistory: [],
  rejectReason: '',
  products: []
})

onMounted(async () => {
  try {
    const res = await fetchOrderDetail(orderId)
    const detail = res.data.data

    console.log('detail: ', detail)
    orderData.orderInfo = detail.orderInfo || {}
    orderData.franchiseOwnerInfo = detail.franchiseOwnerInfo || {}
    orderData.deliveryHistory = detail.deliveryHistory || []
    orderData.rejectReason = detail.rejectReason || ''
    orderData.products = detail.products || []
  } catch (e) {
    console.error('상세 조회 오류:', e)
  }
})


// 수정 버튼에 대한 처리
const handleEdit = () => {
  router.push({
    name: 'OrderRegisterView',
    // state: {
    //   mode: 'edit',
    //   orderId: orderId,
    //   orderInfo: orderData.orderInfo,
    //   products: orderData.products
    // }
  })
}

const canEdit = computed(() => {
  return userRole.value === 'FRANCHISE_MANAGER'
      && orderData.orderInfo?.orderStatus === 'REQUESTED'
})

// 취소 버튼에 대한 처리
const canCancel = computed(() =>
    userRole.value === 'FRANCHISE_MANAGER'
    && orderData.orderInfo?.orderStatus === 'REQUESTED'
)

const openCancelModal = () => {
  showCancelModal.value = true
}

// 승인 버튼에 대한 처리
const canApprove = computed(() =>
    ['GENERAL_MANAGER', 'SENIOR_MANAGER'].includes(userRole.value)
    && orderData.orderInfo?.orderStatus === 'REQUESTED'
)

// 반려 버튼에 대한 처리
const canReject = computed(() =>
    ['GENERAL_MANAGER', 'SENIOR_MANAGER'].includes(userRole.value)
    && orderData.orderInfo?.orderStatus === 'REQUESTED'
)

// 반품 버튼에 대한 처리
const canReturn = computed(() => {
  return (
      userRole.value === 'FRANCHISE_MANAGER'
      && orderData.orderInfo?.orderStatus === 'APPROVED'
      && orderData.deliveryHistory?.[0]?.deliveryStatus === 'DELIVERED'
  )
})

const goToTakeback = () => {
  router.push('/takeback/list')
}


</script>
