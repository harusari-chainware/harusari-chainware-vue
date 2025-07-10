
<template>
  <InfoGroup title="기본 정보">
    <InfoItem>
      <template #label>품의 코드</template>
      <template #value>{{ requisitionDetail.requisitionCode }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>품의 상태</template>
      <template #value>
        <StatusBadge :status="requisitionDetail.status" />
      </template>
    </InfoItem>

    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ requisitionDetail.dueDate }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'
import StatusBadge from "@/components/common/StatusBadge.vue";

defineProps({
  requisitionDetail: {
    type: Object,
    required: true
  }
})

</script>
