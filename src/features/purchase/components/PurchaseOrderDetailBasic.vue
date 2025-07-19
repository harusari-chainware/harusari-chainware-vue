<template>
  <section class="grid grid-2 gap-6">
    <PurchaseOrderDetailBasicInfo
        v-if="purchaseDetail"
        :purchaseDetail="purchaseDetail"
    />
    <PurchaseOrderDetailDate
        v-if="purchaseDetail"
        :purchaseDetail="purchaseDetail"
    />
  </section>



  <section class="grid grid-2 gap-6">
    <PurchaseOrderDetailDrafterInfo
        v-if="purchaseDetail"
        :purchaseDetail="purchaseDetail"
    />
    <PurchaseOrderDetailVendor
        v-if="purchaseDetail"
        :purchaseDetail="purchaseDetail"
    />
  </section>

  <section class="grid grid-2 gap-6">
    <PurchaseOrderDetailWarehouse
        v-if="purchaseDetail"
        :purchaseDetail="purchaseDetail"
    />
  </section>
</template>

<script setup>
import PurchaseOrderDetailBasicInfo from './PurchaseOrderDetailBasicInfo.vue'
import PurchaseOrderDetailDate from './PurchaseOrderDetailDate.vue'
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
