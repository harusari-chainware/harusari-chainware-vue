<template>
  <section class="grid grid-2 gap-6">
    <OrderDetailBasicInfo
        :orderInfo="orderInfo" />
    <OrderDetailDate :orderInfo="orderInfo" />
  </section>

  <section class="grid grid-2 gap-6">
    <OrderDetailFranchise :franchiseOwnerInfo="franchiseOwnerInfo" />
    <OrderDetailSummary :orderInfo="orderInfo" />
  </section>

  <OrderDetailDeliveryHistory
      v-if="deliveryHistory.length"
      :history="deliveryHistory"
  />
  <OrderDetailRejectReason :reason="rejectReason" v-if="rejectReason" />
</template>

<script setup>
import OrderDetailBasicInfo from './detailview/OrderDetailBasicInfo.vue'
import OrderDetailDate from './detailview/OrderDetailDate.vue'
import OrderDetailFranchise from './detailview/OrderDetailFranchise.vue'
import OrderDetailDeliveryHistory from './detailview/OrderDetailDeliveryHistory.vue'
import OrderDetailSummary from './detailview/OrderDetailSummary.vue'
import OrderDetailRejectReason from './detailview/OrderDetailRejectReason.vue'

defineProps({
  orderInfo: Object,
  franchiseOwnerInfo: Object,
  deliveryHistory: Array,
  rejectReason: String
})
</script>
