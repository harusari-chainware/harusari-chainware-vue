
<template>
  <InfoGroup title="거래처 정보">
    <InfoItem>
      <template #label>거래처명</template>
      <template #value>{{ purchaseDetail.vendor.name }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>유형</template>
      <template #value>{{ purchaseDetail.vendor.type }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>담당자</template>
      <template #value>{{ purchaseDetail.vendor.managerName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>거래처 연락처</template>
      <template #value>{{ purchaseDetail.vendor.vendorContact }}</template>
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
