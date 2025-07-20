<template>
  <InfoGroup title="배송 관련 주문 정보" :columns="2">
    <InfoItem>
      <template #label>주문 코드</template>
      <template #value>{{ orderInfo.orderCode }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>제품 수</template>
      <template #value>{{ formatAmount(orderInfo.productCount) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>총 수량</template>
      <template #value>{{ formatAmount(orderInfo.totalQuantity) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>총 금액</template>
      <template #value>{{ formatCurrency(orderInfo.totalPrice) }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import { formatAmount, formatCurrency } from '@/utils/tableUtils.js'

defineProps({ orderInfo: Object })
</script>