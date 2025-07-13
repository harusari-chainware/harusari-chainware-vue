<template>
  <InfoGroup title="기본 정보">
    <InfoItem>
      <template #label>주문 코드</template>
      <template #value>{{ orderInfo.orderCode }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>주문 상태</template>
      <template #value>
        <StatusBadge :status="orderInfo.orderStatus || '-'" />
      </template>
    </InfoItem>
    <InfoItem>
      <template #label>관련 배송 코드</template>
      <template #value>{{ orderInfo.deliveryCode || '-' }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  orderInfo: Object
})
</script>
