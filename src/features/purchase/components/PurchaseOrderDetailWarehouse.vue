
<template>
  <InfoGroup title="창고 정보">
    <InfoItem>
      <template #label>창고명</template>
      <template #value>{{ purchaseDetail.warehouse.name }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>담당자</template>
      <template #value>{{ purchaseDetail.warehouse.managerName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>창고 연락처</template>
      <template #value>{{ purchaseDetail.warehouse.warehouseContact }}</template>
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
