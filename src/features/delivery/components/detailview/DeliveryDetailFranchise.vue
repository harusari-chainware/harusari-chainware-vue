<template>
  <InfoGroup title="가맹점 정보">
    <InfoItem>
      <template #label>가맹점명</template>
      <template #value>{{ franchiseInfo.franchiseName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>가맹점 주소</template>
      <template #value>{{ franchiseInfo.franchiseAddress.fullAddress }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>점주 이름</template>
      <template #value>{{ franchiseInfo.ownerName }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({ franchiseInfo: Object })
</script>
