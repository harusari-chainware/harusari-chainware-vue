
<template>
  <InfoGroup title="가맹점 정보">
    <InfoItem>
      <template #label>가맹점명</template>
      <template #value>{{ order.franchiseName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>가맹점 연락처</template>
      <template #value>{{ order.franchisePhone }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>점주 이름</template>
      <template #value>{{ order.ownerName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>연락처</template>
      <template #value>{{ order.ownerPhone }}</template>
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
