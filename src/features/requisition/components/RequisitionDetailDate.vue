<template>
  <InfoGroup title="일시 정보">
    <InfoItem>
      <template #label>작성 일시</template>
      <template #value>{{ requisition.createdAt }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>{{ statusLabel }}</template>
      <template #value>{{ requisition.updatedAt }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ requisition.dueDate }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import { computed } from 'vue'
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

const props = defineProps({
  requisition: {
    type: Object,
    required: true
  }
})

const statusLabel = computed(() => {
  const status = props.requisition.status
  if (status === 'APPROVED') return '승인 일시'
  if (status === 'REJECTED') return '반려 일시'
  return '수정 일시'
})
</script>
