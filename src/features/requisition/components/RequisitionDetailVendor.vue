<template>
  <InfoGroup title="거래처 정보">
    <InfoItem>
      <template #label>이름</template>
      <template #value>{{ requisition.venderName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>연락처</template>
      <template #value>{{ requisition.vendorContact }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({
  requisition: {
    type: Object,
    required: true
  }
})
</script>
