<template>
  <InfoGroup title="작성자 정보">
    <InfoItem>
      <template #label>이름</template>
      <template #value>{{ requisition.drafterName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>이메일</template>
      <template #value>{{ requisition.drafterEmail }}</template>
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
