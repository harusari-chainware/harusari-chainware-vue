<template>
  <section class="grid grid-2 gap-6">
    <RequisitionDetailBasicInfo :requisitionDetail="requisitionDetail" />
    <RequisitionDetailDate :requisitionDetail="requisitionDetail" />
  </section>

  <section class="grid grid-2 gap-6">
    <RequisitionDetailDrafterInfo :requisitionDetail="requisitionDetail" />
    <RequisitionDetailApproverInfo :requisitionDetail="requisitionDetail" />
  </section>

  <section class="grid grid-2 gap-6">
    <RequisitionDetailVendor :requisitionDetail="requisitionDetail" />
    <RequisitionDetailWarehouse :requisitionDetail="requisitionDetail" />
  </section>
</template>

<script setup>
import RequisitionDetailBasicInfo from './RequisitionDetailBasicInfo.vue'
import RequisitionDetailDate from './RequisitionDetailDate.vue'
import RequisitionDetailApproverInfo from './RequisitionDetailApproverInfo.vue'
import RequisitionDetailDrafterInfo from './RequisitionDetailDrafterInfo.vue'
import RequisitionDetailVendor from './RequisitionDetailVendor.vue'
import RequisitionDetailWarehouse from './RequisitionDetailWarehouse.vue'

defineProps({
  requisitionDetail: {
    type: Object,
    required: true
  }
})
</script>
