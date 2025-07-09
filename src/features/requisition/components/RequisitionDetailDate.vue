<template>
  <InfoGroup title="일시 정보">
    <InfoItem>
      <template #label>발주 일시</template>
      <template #value>{{ formatDateTime(requisitionDetail.createdAt) }}</template>
    </InfoItem>

    <InfoItem>
      <template #label>{{ statusLabel }}</template>
      <template #value>{{ formatDateTime(requisitionDetail.submittedAt) }}</template>
    </InfoItem>

    <InfoItem>
      <template #label>납기일</template>
      <template #value>{{ formatDate(requisitionDetail.dueDate) }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import { computed } from 'vue'
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

const props = defineProps({
  requisitionDetail: {
    type: Object,
    required: true
  }
})

const statusLabel = computed(() => {
  const status = props.requisitionDetail.status
  if (status === 'APPROVED') return '승인 일시'
  if (status === 'REJECTED') return '반려 일시'
  return '수정 일시'
})
/**
 * 상태에 따라 표시할 날짜 선택
 */
const formattedStatusDate = computed(() => {
  const status = props.purchaseDetail.status
  const date =
      status === 'APPROVED'
          ? props.purchaseDetail.approvedAt
          : status === 'REJECTED'
              ? props.purchaseDetail.rejectedAt
              : props.purchaseDetail.updatedAt || props.purchaseDetail.submittedAt
  return formatDateTime(date)
})

/**
 * 날짜 포맷터: '2025-07-08T11:49:14' → '2025년 07월 08일 11:49'
 */
function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}년 ${pad(date.getMonth() + 1)}월 ${pad(date.getDate())}일 ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 날짜만 포맷 (예: 납기일 등)
 */
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}년 ${pad(date.getMonth() + 1)}월 ${pad(date.getDate())}일`
}

/**
 * 보조: 1자리 숫자를 2자리로 채움
 */
function pad(n) {
  return n.toString().padStart(2, '0')
}
</script>
