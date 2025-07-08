<template>
  <InfoGroup title="창고 정보">
    <InfoItem>
      <template #label>창고명</template>
      <template #value>{{ requisition.warehouseName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>주소</template>
      <template #value>{{ requisition.warehouseLocation }}</template>
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
