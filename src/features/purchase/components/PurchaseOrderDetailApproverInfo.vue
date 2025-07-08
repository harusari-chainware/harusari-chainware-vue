
<template>
  <InfoGroup title="결재자 정보">
    <InfoItem>
      <template #label>이름</template>
      <template #value>{{ purchaseDetail.approverName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>직책</template>
      <template #value>{{ purchaseDetail.approverPosition }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>이메일</template>
      <template #value>{{ purchaseDetail.approverEmail }}</template>
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
