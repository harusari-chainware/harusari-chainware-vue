
<template>
  <InfoGroup title="기본 정보">
    <InfoItem>
      <template #label>발주 코드</template>
      <template #value>{{ purchaseDetail.purchaseOrderCode }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>발주 상태</template>
      <template #value>
        <StatusBadge :status="purchaseDetail.status" />
      </template>
    </InfoItem>
    <InfoItem>
      <template #label>관련 품의 코드</template>
      <template #value>{{ purchaseDetail.requisitionCode }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ purchaseDetail.dueDate }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  purchaseDetail: {
    type: Object,
    required: true
  }
})
</script>
