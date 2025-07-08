<template>
  <section class="grid grid-2 gap-6">
    <PurchaseOrderDetailBasicInfo :purchaseDetail="purchaseDetail" />
    <PurchaseOrderDetailDate :purchaseDetail="purchaseDetail" />
  </section>

  <section class="grid grid-2 gap-6">
    <PurchaseOrderDetailDrafterInfo :purchaseDetail="purchaseDetail" />
    <PurchaseOrderDetailApproverInfo :purchaseDetail="purchaseDetail"/>
  </section>

  <section class="grid grid-2 gap-6">
    <PurchaseOrderDetailVendor :purchaseDetail="purchaseDetail" />
    <PurchaseOrderDetailWarehouse :purchaseDetail="purchaseDetail" />
  </section>
</template>

<script setup>
import PurchaseOrderDetailBasicInfo from './PurchaseOrderDetailBasicInfo.vue'
import PurchaseOrderDetailDate from './PurchaseOrderDetailDate.vue'
import PurchaseOrderDetailApproverInfo from './PurchaseOrderDetailApproverInfo.vue'
import PurchaseOrderDetailDrafterInfo from './PurchaseOrderDetailDrafterInfo.vue'
import PurchaseOrderDetailVendor from './PurchaseOrderDetailVendor.vue'
import PurchaseOrderDetailWarehouse from './PurchaseOrderDetailWarehouse.vue'

defineProps({
  purchaseDetail: {
    type: Object,
    required: true
  }
})
</script>
