<!-- src/features/takeback/components/TakeBackTable.vue -->
<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  items: Array
})

const statusMap = {
  REQUESTED: { text: '요청됨', class: 'status-requested' },
  COLLECTED: { text: '수거됨', class: 'status-collected' },
  APPROVED: { text: '승인됨', class: 'status-approved' },
  REJECTED: { text: '반려됨', class: 'status-rejected' },
  CANCELED: { text: '취소됨', class: 'status-canceled' }
}
</script>

<template>
  <table class="table w-full">
    <thead>
    <tr>
      <th>반품 ID</th>
      <th>주문 번호</th>
      <th>가맹점명</th>
      <th>제품명</th>
      <th>수량</th>
      <th>반품 사유</th>
      <th>상태</th>
      <th>신청일</th>
      <th>작업</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="items.length === 0">
      <td colspan="9" class="text-center p-4">검색 결과가 없습니다.</td>
    </tr>
    <tr v-for="item in items" :key="item.takeBackId">
      <td>{{ item.takeBackId }}</td>
      <td>{{ item.orderNumber }}</td>
      <td>{{ item.franchiseName }}</td>
      <td>{{ item.productName }}</td>
      <td>{{ item.quantity }} {{ item.unit }}</td>
      <td>{{ item.reasonSummary }}</td>
      <td>
        <div class="status-badge" :class="statusMap[item.status]?.class">
          <span class="status-badge-dot" />
          <span>{{ statusMap[item.status]?.text }}</span>
        </div>
      </td>
      <td>{{ new Date(item.requestDate).toLocaleDateString('ko-KR') }}</td>
      <td>
        <RouterLink :to="`/takeback/detail/${item.takeBackId}`" class="action-btn action-btn-view">상세</RouterLink>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}
.status-badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.375rem;
}
.status-requested { background: rgba(59,130,246,0.1); color: #3b82f6; }
.status-requested .status-badge-dot { background: #3b82f6; }
.status-collected { background: rgba(245,158,11,0.1); color: #f59e0b; }
.status-collected .status-badge-dot { background: #f59e0b; }
.status-approved { background: rgba(16,185,129,0.1); color: #10b981; }
.status-approved .status-badge-dot { background: #10b981; }
.status-rejected { background: rgba(239,68,68,0.1); color: #ef4444; }
.status-rejected .status-badge-dot { background: #ef4444; }
.status-canceled { background: rgba(107,114,128,0.1); color: #6b7280; }
.status-canceled .status-badge-dot { background: #6b7280; }
</style>
