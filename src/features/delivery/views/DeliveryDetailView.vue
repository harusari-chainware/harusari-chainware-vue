<template>
  <DetailLayout
      v-if="!!deliveryData.deliveryInfo"
      title="배송 상세"
      description="배송 기본 정보 및 상세 내역을 확인할 수 있습니다."
  >
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
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import DeliveryDetailBasic from '../components/DeliveryDetailBasic.vue'
import DeliveryDetailTable from '../components/DeliveryDetailTable.vue'
import { fetchDeliveryDetail } from '../api.js'

const route = useRoute()
const deliveryId = route.params.deliveryId

const deliveryData = reactive({
  deliveryInfo: null,
  warehouseInfo: null,
  franchiseInfo: null,
  orderInfo: null,
  takeBackInfo: null,
  products: [],
  takeBackProducts: []
})

const loadDeliveryDetail = async () => {
  try {
    const res = await fetchDeliveryDetail(deliveryId)
    const data = res.data.data

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

onMounted(loadDeliveryDetail)
</script>
