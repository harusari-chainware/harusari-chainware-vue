<template>
  <InfoGroup title="주문 배송 이력 조회">
    <DetailTable
        :columns="columns"
        :items="history"
        style="padding: 0;"
    >
      <template #cell-startedAt="{ value }">
        {{ value || '-' }}
      </template>
      <template #cell-deliveredAt="{ value }">
        {{ value || '-' }}
      </template>
      <template #cell-deliveryStatus="{ value }">
        <StatusBadge :status="value" />
      </template>
    </DetailTable>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import DetailTable from '@/components/layout/detailview/DetailTable.vue'
import StatusBadge from "@/components/common/StatusBadge.vue";

defineProps({
  history: Array
})

const columns = [
  { key: 'deliveryStatus', label: '상태', align: 'center' },
  { key: 'handlerName', label: '택배사', align: 'center' },
  { key: 'startedAt', label: '배송 시작 일시', align: 'center' },
  { key: 'deliveredAt', label: '배송 완료 일시', align: 'center' }
]
</script>
