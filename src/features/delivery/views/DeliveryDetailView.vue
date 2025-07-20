<template>
  <DetailLayout
      v-if="!!deliveryData.deliveryInfo"
      title="배송 상세"
      description="배송 기본 정보 및 상세 내역을 확인할 수 있습니다."
  >
    <!-- 버튼 영역 -->
    <template #actions>
      <StatusButton v-if="canStart" type="approve" @click="showStartModal = true">
        배송 시작
      </StatusButton>
      <StatusButton v-if="canComplete" type="complete" @click="showCompleteModal = true">
        배송 완료
      </StatusButton>
    </template>

    <!-- 기본 정보 -->
    <template #basic>
      <DeliveryDetailBasic
          :deliveryInfo="deliveryData.deliveryInfo"
          :warehouseInfo="deliveryData.warehouseInfo"
          :franchiseInfo="deliveryData.franchiseInfo"
          :orderInfo="deliveryData.orderInfo"
          :takeBackInfo="deliveryData.takeBackInfo"
      />
    </template>

    <!-- 상세 테이블 -->
    <template #detail>
      <DeliveryDetailTable
          :products="deliveryData.products"
          :takeBackProducts="deliveryData.takeBackProducts"
          :isRedelivery="deliveryData.deliveryInfo?.deliveryMethod === 'REDELIVERY'"
      />
    </template>
  </DetailLayout>

  <!-- 모달들 -->
  <DeliveryStartModal
      v-if="showStartModal"
      :deliveryId="Number(deliveryId)"
      :isRedelivery="deliveryData.deliveryInfo?.deliveryMethod === 'REDELIVERY'"
      :products="deliveryData.products"
      @close="showStartModal = false"
      @started="handleStartSuccess"
  />

  <DeliveryCompleteModal
      v-if="showCompleteModal"
      :deliveryId="Number(deliveryId)"
      @close="showCompleteModal = false"
      @completed="handleCompleteSuccess"
  />
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDeliveryDetail } from '../api.js'
import { useAuthStore } from "@/features/auth/useAuthStore.js";
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from "@/components/common/StatusButton.vue"

import DeliveryDetailBasic from '../components/DeliveryDetailBasic.vue'
import DeliveryDetailTable from '../components/DeliveryDetailTable.vue'
import DeliveryStartModal from '../components/modal/DeliveryStartModal.vue'
import DeliveryCompleteModal from '../components/modal/DeliveryCompleteModal.vue'

// params
const route = useRoute()
const deliveryId = route.params.deliveryId

// auth
const authStore = useAuthStore()
const userRole = computed(() => authStore.authority)

// modal 상태
const showStartModal = ref(false)
const showCompleteModal = ref(false)

// 데이터 객체
const deliveryData = reactive({
  deliveryInfo: null,
  warehouseInfo: null,
  franchiseInfo: null,
  orderInfo: null,
  takeBackInfo: null,
  products: [],
  takeBackProducts: []
})

// 버튼 노출 조건
const canStart = computed(() =>
    userRole.value === 'WAREHOUSE_MANAGER' &&
    deliveryData.deliveryInfo?.deliveryStatus === 'REQUESTED'
)

const canComplete = computed(() =>
    userRole.value === 'FRANCHISE_MANAGER' &&
    deliveryData.deliveryInfo?.deliveryStatus === 'IN_TRANSIT'
)

// 데이터 로딩
const loadDeliveryDetail = async () => {
  try {
    const res = await fetchDeliveryDetail(deliveryId)
    const data = res.data.data
    console.log(data)

    deliveryData.deliveryInfo = data.deliveryInfo
    deliveryData.warehouseInfo = data.warehouseInfo
    deliveryData.franchiseInfo = data.franchiseInfo
    deliveryData.orderInfo = data.orderInfo
    deliveryData.takeBackInfo = data.takeBackInfo
    deliveryData.products = data.products || []
    deliveryData.takeBackProducts = data.takeBackProducts || []
  } catch (e) {
    console.error('배송 상세 조회 실패', e)
  }
}

// 모달 후처리
const handleStartSuccess = () => {
  showStartModal.value = false
  loadDeliveryDetail()
}

const handleCompleteSuccess = () => {
  showCompleteModal.value = false
  loadDeliveryDetail()
}

onMounted(loadDeliveryDetail)
</script>
