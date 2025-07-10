<template>
  <DetailLayout
      v-if="!!orderData.orderInfo?.orderCode"
      title="주문 상세"
      description="주문의 기본 정보와 상세 내용을 확인할 수 있습니다."
  >
    <!-- 상단 버튼 영역 -->
    <template #actions>
      <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
      <StatusButton type="approve">승인</StatusButton>
      <StatusButton type="reject">반려</StatusButton>
      <StatusButton type="return">반품하기</StatusButton>
    </template>

    <!-- 기본 정보 영역 -->
    <template #basic>
<!--      {{ orderData.orderInfo.orderCode }}-->
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
<!--      <OrderDetailDetail :items="orderData.products || []" />-->
    </template>
  </DetailLayout>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue'
import { useRoute } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import OrderDetailBasic from '../components/OrderDetailBasic.vue'
import OrderDetailDetail from '../components/OrderDetailDetail.vue'
import { fetchOrderDetail } from '../api.js'

const route = useRoute()
const orderId = route.params.orderId

const orderData = reactive({
  orderInfo: {},
  franchiseOwnerInfo: {},
  deliveryHistory: [],
  rejectReason: '',
  products: []
})


const handleEdit = () => {
  alert('수정 버튼 클릭됨')
}

onMounted(async () => {
  try {
    const res = await fetchOrderDetail(orderId)
    console.log('✅ fetchOrders 응답:', res)
    console.log('📦 res.data:', res.data)

    const detail = res.data.data // ✅ 진짜 데이터 추출

    console.log('🧪 detail:', detail)

    orderData.orderInfo = detail.orderInfo || {}
    orderData.franchiseOwnerInfo = detail.franchiseOwnerInfo || {}
    orderData.deliveryHistory = detail.deliveryHistory || []
    orderData.rejectReason = detail.rejectReason || ''
    orderData.products = detail.products || []

    // console.log('✅ orderData 상태:', JSON.stringify(orderData, null, 2))
  } catch (e) {
    console.error('상세 조회 오류:', e)
  }
})


</script>
