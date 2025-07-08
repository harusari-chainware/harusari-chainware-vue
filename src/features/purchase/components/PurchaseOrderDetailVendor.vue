
<template>
  <InfoGroup title="거래처 정보">
    <InfoItem>
      <template #label>거래처명</template>
      <template #value>{{ purchaseDetail.vendorName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>유형</template>
      <template #value>{{ purchaseDetail.vendorType }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>담당자</template>
      <template #value>{{ purchaseDetail.vendorManagerName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>가맹점 연락처</template>
      <template #value>{{ purchaseDetail.vendorContact }}</template>
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
