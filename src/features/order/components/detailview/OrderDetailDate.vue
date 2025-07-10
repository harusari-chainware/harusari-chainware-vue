<template>
  <InfoGroup title="일시 정보">
    <InfoItem>
      <template #label>주문 일시</template>
      <template #value>{{ orderInfo.createdAt }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>수정 일시</template>
      <template #value>{{ orderInfo.modifiedAt }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({
  orderInfo: Object
})
</script>
