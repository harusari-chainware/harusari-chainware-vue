
<template>
  <InfoGroup title="작성자 정보">
    <InfoItem>
      <template #label>이름</template>
      <template #value>{{ purchaseDetail.drafter.name }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>직책</template>
      <template #value>{{ purchaseDetail.drafter.position }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>이메일</template>
      <template #value>{{ purchaseDetail.drafter.email}}</template>
    </InfoItem>
    <InfoItem>
      <template #label>연락처</template>
      <template #value>{{ purchaseDetail.drafter.contact}}</template>
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
