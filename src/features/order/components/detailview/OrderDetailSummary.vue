<template>
  <InfoGroup title="주문 정보">
    <InfoItem>
      <template #label>총 제품 수</template>
      <template #value>{{ formatAmount(orderInfo.totalProductCount) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>총 금액</template>
      <template #value>{{ formatCurrency(orderInfo.totalPrice) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ orderInfo.deliveryDueDate }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import {formatAmount, formatCurrency} from '@/utils/tableUtils.js'

defineProps({
  orderInfo: Object
})
</script>
