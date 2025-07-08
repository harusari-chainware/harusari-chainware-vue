<template>
  <section class="grid grid-2 gap-6">
    <OrderDetailBasicInfo :order="order" />
    <OrderDetailDate :order="order" />
  </section>

  <section class="grid grid-2 gap-6">
    <OrderDetailFranchise :order="order" />
    <OrderDetailDeliveryHistory :history="order.deliveryHistory" />
  </section>

  <OrderDetailSummary :order="order" />
  <OrderDetailRejectReason :reason="order.rejectReason" v-if="order.rejectReason" />
</template>

<script setup>
import OrderDetailBasicInfo from './detailview/OrderDetailBasicInfo.vue'
import OrderDetailDate from './detailview/OrderDetailDate.vue'
import OrderDetailFranchise from './detailview/OrderDetailFranchise.vue'
import OrderDetailDeliveryHistory from './detailview/OrderDetailDeliveryHistory.vue'
import OrderDetailSummary from './detailview/OrderDetailSummary.vue'
import OrderDetailRejectReason from './detailview/OrderDetailRejectReason.vue'

defineProps({
  order: {
    type: Object,
    required: true
  }
})
</script>
