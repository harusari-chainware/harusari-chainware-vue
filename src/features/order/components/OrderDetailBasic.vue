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
import OrderDetailBasicInfo from './OrderDetailBasicInfo.vue'
import OrderDetailDate from './OrderDetailDate.vue'
import OrderDetailFranchise from './OrderDetailFranchise.vue'
import OrderDetailDeliveryHistory from './OrderDetailDeliveryHistory.vue'
import OrderDetailSummary from './OrderDetailSummary.vue'
import OrderDetailRejectReason from './OrderDetailRejectReason.vue'

defineProps({
  order: {
    type: Object,
    required: true
  }
})
</script>
