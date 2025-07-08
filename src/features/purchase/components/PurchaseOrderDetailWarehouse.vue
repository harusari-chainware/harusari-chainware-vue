
<template>
  <InfoGroup title="창고 정보">
    <InfoItem>
      <template #label>창고명</template>
      <template #value>{{ purchaseDetail.warehouseName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>담당자</template>
      <template #value>{{ purchaseDetail.warehouseManagerName }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({
  purchaseDetail: {
    type: Object,
    required: true
  }
})
</script>
