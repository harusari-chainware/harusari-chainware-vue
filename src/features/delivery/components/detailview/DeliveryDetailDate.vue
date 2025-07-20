<template>
  <InfoGroup title="일시 정보">
    <InfoItem>
      <template #label>배송 요청 일시</template>
      <template #value>{{ formatDateTime(deliveryInfo.createdAt) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>배송 시작 일시</template>
      <template #value>{{ formatDateTime(deliveryInfo.startedAt) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>배송 완료 일시</template>
      <template #value>{{ formatDateTime(deliveryInfo.deliveredAt) }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import { formatDateTime } from '@/utils/tableUtils.js'

defineProps({ deliveryInfo: Object })
</script>
