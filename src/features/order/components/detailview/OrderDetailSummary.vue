
<template>
  <InfoGroup title="주문 정보" :columns="2">
    <InfoItem>
      <template #label>총 제품 수</template>
      <template #value>{{ order.totalProductCount }}개</template>
    </InfoItem>
    <InfoItem>
      <template #label>총 금액</template>
      <template #value>{{ formatCurrency(order.totalPrice) }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>총 수량</template>
      <template #value>{{ order.totalQuantity }}개</template>
    </InfoItem>
    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ order.dueDate }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import { formatCurrency } from '@/utils/tableUtils.js'

defineProps({
  order: {
    type: Object,
    required: true
  }
})
</script>
