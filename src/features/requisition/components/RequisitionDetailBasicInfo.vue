<template>
  <InfoGroup title="기본 정보">
    <InfoItem>
      <template #label>품의 코드</template>
      <template #value>{{ requisition.requisitionCode }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>품의 상태</template>
      <template #value>{{ requisition.status }}</template>
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
