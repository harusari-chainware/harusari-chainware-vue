
<template>
  <InfoGroup title="일시 정보">
    <InfoItem>
      <template #label>주문 일시</template>
      <template #value>{{ order.createdAt }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>수정 일시</template>
      <template #value>{{ order.updatedAt }}</template>
    </InfoItem>
    <InfoItem v-if="order.deliveredAt">
      <template #label>배송 완료일</template>
      <template #value>{{ order.deliveredAt }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({
  order: {
    type: Object,
    required: true
  }
})
</script>
