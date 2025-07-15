<template>
  <InfoGroup title="가맹점 정보">
    <InfoItem>
      <template #label>가맹점명</template>
      <template #value>{{ franchiseOwnerInfo.franchiseName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>가맹점 연락처</template>
      <template #value>{{ franchiseOwnerInfo.franchisePhone }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>점주 이름</template>
      <template #value>{{ franchiseOwnerInfo.ownerName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>연락처</template>
      <template #value>{{ franchiseOwnerInfo.ownerPhone }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({
  franchiseOwnerInfo: Object
})
</script>
