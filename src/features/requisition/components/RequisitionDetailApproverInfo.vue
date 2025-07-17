<template>
  <InfoGroup title="결재자 정보">
    <InfoItem>
      <template #label>이름</template>
      <template #value>{{ requisitionDetail.approver.name }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>직책</template>
      <template #value>{{ requisitionDetail.approver.position }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>이메일</template>
      <template #value>{{ requisitionDetail.approver.email}}</template>
    </InfoItem>
    <InfoItem>
      <template #label>연락처</template>
      <template #value>{{ requisitionDetail.approver.contact}}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({
  requisitionDetail: {
    type: Object,
    required: true
  }
})
</script>
