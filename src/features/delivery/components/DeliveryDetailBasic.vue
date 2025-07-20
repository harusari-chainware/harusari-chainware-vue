<template>
  <section class="grid grid-2 gap-6">
    <DeliveryDetailBasicInfo :deliveryInfo="deliveryInfo" />
    <DeliveryDetailDate :deliveryInfo="deliveryInfo" />
  </section>

  <section class="grid grid-2 gap-6">
    <DeliveryDetailWarehouse :warehouseInfo="warehouseInfo" />
    <DeliveryDetailFranchise :franchiseInfo="franchiseInfo" />
  </section>

  <DeliveryDetailOrderSummary
      v-if="deliveryInfo?.deliveryMethod !== 'REDELIVERY'"
      :orderInfo="orderInfo"
  />
  <DeliveryDetailTakeBackSummary
      v-else
      :takeBackInfo="takeBackInfo"
  />
</template>

<script setup>
import DeliveryDetailBasicInfo from './detailview/DeliveryDetailBasicInfo.vue'
import DeliveryDetailDate from './detailview/DeliveryDetailDate.vue'
import DeliveryDetailWarehouse from './detailview/DeliveryDetailWarehouse.vue'
import DeliveryDetailFranchise from './detailview/DeliveryDetailFranchise.vue'
import DeliveryDetailOrderSummary from './detailview/DeliveryDetailOrderSummary.vue'
import DeliveryDetailTakeBackSummary from './detailview/DeliveryDetailTakeBackSummary.vue'

defineProps({
  deliveryInfo: Object,
  warehouseInfo: Object,
  franchiseInfo: Object,
  orderInfo: Object,
  takeBackInfo: Object
})
</script>
