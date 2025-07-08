
<template>
  <InfoGroup title="일시 정보">
    <InfoItem>
      <template #label>발주 일시</template>
      <template #value>{{ purchaseDetail.createdAt }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>{{ statusLabel }}</template>
      <template #value>{{ purchaseDetail.updatedAt }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ purchaseDetail.dueDate }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import {computed} from "vue";

defineProps({
  purchaseDetail: {
    type: Object,
    required: true
  }
})
const statusLabel = computed(() => {
  const status = props.purchaseDetail.status
  if (status === 'APPROVED') return '승인 일시'
  if (status === 'REJECTED') return '반려 일시'
  return '처리 일시'
})

</script>
