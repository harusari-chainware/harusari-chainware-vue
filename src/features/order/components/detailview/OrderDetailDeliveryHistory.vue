<template>
  <InfoGroup title="주문 배송 이력 조회">
    <DetailTable
        :columns="columns"
        :items="history"
        style="padding: 0;"
    />
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import DetailTable from '@/components/layout/detailview/DetailTable.vue'

defineProps({
  history: {
    type: Array,
    required: true
  }
})

const columns = [
  { key: 'status', label: '상태', align: 'center' },
  { key: 'handler', label: '담당자', align: 'center' },
  { key: 'date', label: '일시', align: 'center' }
]
</script>