<template>
  <section class="grid grid-2 gap-6">
    <RequisitionDetailBasicInfo :requisition="requisition" />
    <RequisitionDetailDate :requisition="requisition" />
  </section>

  <section class="grid grid-2 gap-6">
    <RequisitionDetailDrafterInfo :requisition="requisition" />
    <RequisitionDetailApproverInfo :requisition="requisition" />
  </section>

  <section class="grid grid-2 gap-6">
    <RequisitionDetailVendor :requisition="requisition" />
    <RequisitionDetailWarehouse :requisition="requisition" />
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
  requisition: {
    type: Object,
    required: true
  }
})
</script>
