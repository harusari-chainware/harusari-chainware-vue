<template>
  <InfoGroup title="배송 기본 정보">
    <InfoItem>
      <template #label>운송장 번호</template>
      <template #value>{{ deliveryInfo.trackingNumber }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>택배사</template>
      <template #value>{{ deliveryInfo.carrier }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>배송 상태</template>
      <template #value>
        <StatusBadge :status="deliveryInfo.deliveryStatus" />
      </template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({ deliveryInfo: Object })
</script>