<template>
  <GenericTable :items="deliveries ?? []" :columns="columns">
    <!-- 배송 상태 뱃지 표시 -->
    <template #cell-deliveryStatus="{ value }">
      <StatusBadge :status="value" />
    </template>

    <!-- 날짜 포맷 -->
    <template #cell-startedAt="{ value }">
      {{ formatDateTime(value) }}
    </template>

    <template #cell-deliveredAt="{ value }">
      {{ formatDateTime(value) }}
    </template>

    <!-- 상세보기 -->
    <template #cell-actions="{ item }">
      상세보기
<!--      <RouterLink-->
<!--          :to="{ name: 'DeliveryDetailView'}"-->
<!--          class="detail-link"-->
<!--      >-->
<!--        상세보기-->
<!--      </RouterLink>-->
    </template>
  </GenericTable>
</template>

<script setup>
import { defineProps } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatDateTime } from '@/utils/tableUtils'

const props = defineProps({
  deliveries: {
    type: Array,
    default: () => [],
  }
})

const columns = [
  { key: 'deliveryId', label: 'No', align: 'center' },
  { key: 'warehouseName', label: '창고명', align: 'left' },
  { key: 'franchiseName', label: '가맹점명', align: 'left' },
  { key: 'trackingNumber', label: '운송장번호', align: 'center' },
  { key: 'carrier', label: '택배사', align: 'center' },
  { key: 'orderCode', label: '관련 주문코드', align: 'center' },
  { key: 'deliveryStatus', label: '배송 상태', align: 'center' },
  { key: 'startedAt', label: '배송 요청일시', align: 'center' },
  { key: 'deliveredAt', label: '배송 완료일시', align: 'center' },
  { key: 'actions', label: '상세', align: 'center' }
]
</script>

<style scoped>
.detail-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}
.detail-link:hover {
  text-decoration: underline;
}
</style>
