<template>
  <span
      class="status-badge"
      :class="statusClass"
      :title="label"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

// 상태별 한글 라벨 + 색상 클래스 정의
const statusMap = {
  // 🔹 보관 유형 (store_type)
  CHILLED: {label: '냉장', class: 'blue'},
  FROZEN: {label: '냉동', class: 'skyblue'},
  ROOM_TEMPERATURE: {label: '상온', class: 'orange'},

  // 🔹 업체 유형 (vendor_type)
  SUPPLIER: {label: '공급업체', class: 'green'},
  TRUST_CONTRACTOR: {label: '위탁업체', class: 'purple'},
  LOGISTICS: {label: '물류', class: 'blue'},
  AGENCY: {label: '대행업체', class: 'gray'},

  // 🔹 계약 상태 (vendor_status)
  ACTIVE: {label: '계약 중', class: 'green'},
  EXPIRED: {label: '계약 만료', class: 'red'},

  // 🔹 가맹점 상태 (franchise_status)
  OPERATING: {label: '영업중', class: 'green'},
  TEMPORARILY_CLOSED: {label: '휴점', class: 'yellow'},
  PREPARING: {label: '준비중', class: 'gray'},
  CLOSED: {label: '폐점', class: 'red'},

  // 🔹 가맹점 발주 상태 (store_order_status)
  REQUESTED: {label: '요청', class: 'yellow'},
  CANCELLED: {label: '취소', class: 'red'},
  APPROVED: {label: '승인', class: 'green'},
  REJECTED: {label: '반려', class: 'red'},

  // 🔹 회수 상태 (take_back_status)
  COLLECTED: {label: '수거 완료', class: 'skyblue'},

  // 🔹 배송 상태 (delivery_status)
  IN_TRANSIT: {label: '배송중', class: 'orange'},
  DELIVERED: {label: '배송완료', class: 'skyblue'},

  // 🔹 요청 상태 (requisition_status)
  SAVED: {label: '임시저장', class: 'gray'},
  SUBMITTED: {label: '상신됨', class: 'yellow'},

  // 🔹 구매 발주 상태 (purchase_order_status)
  SHIPPED: {label: '출고완료', class: 'blue'},
  WAREHOUSED: {label: '입고완료', class: 'green'}
}

const label = computed(() => statusMap[props.status]?.label || props.status)
const statusClass = computed(() => `status-${statusMap[props.status]?.class || 'default'}`)
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  min-width: 70px;
  text-align: center;
  white-space: nowrap;
}

/* 소프트톤 색상 정의 */
.status-yellow {
  background-color: #fef3c7;
  color: #92400e;
}

.status-green {
  background-color: #d1fae5;
  color: #065f46;
}

.status-red {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-blue {
  background-color: #dbeafe;
  color: #1e3a8a;
}

.status-skyblue {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-purple {
  background-color: #ede9fe;
  color: #5b21b6;
}

.status-orange {
  background-color: #ffedd5;
  color: #c2410c;
}

.status-gray {
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-default {
  background-color: #e5e7eb;
  color: #374151;
}
</style>
