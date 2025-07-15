<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  items: Array
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncate = (text, maxLen) => {
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}
</script>

<template>
  <div class="table-wrapper">
    <div class="table-header">
      <h2 class="table-title">폐기 내역</h2>
    </div>
    <div v-if="items.length" id="tableContainer">
      <table class="table">
        <thead>
        <tr>
          <th>폐기 ID</th>
          <th>가맹점/창고</th>
          <th>상품명</th>
          <th>상품코드</th>
          <th>수량</th>
          <th>폐기 유형</th>
          <th>폐기 사유</th>
          <th>폐기 일자</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.disposalId">
          <td>{{ item.disposalId }}</td>
          <td>{{ item.franchiseName || item.warehouseName || '-' }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ item.productCode || '-' }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <span :class="['badge', item.takeBackId ? 'badge-warning' : 'badge-info']">
              {{ item.takeBackId ? '반품 폐기' : '일반 폐기' }}
            </span>
          </td>
          <td>{{ truncate(item.disposalReason, 20) }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-state">
      <svg class="empty-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"/>
      </svg>
      <h3 class="empty-title">검색 결과가 없습니다</h3>
      <p class="empty-description">검색 조건을 변경하여 다시 시도해보세요.</p>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 16px 24px;
  margin-top: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background-color: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover {
  background-color: #f3f4f6;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;
}

.badge-info {
  background-color: #e0f2fe;
  color: #0284c7;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.empty-state {
  padding: 64px 0;
  text-align: center;
  background-color: #ffffff;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  color: #d1d5db;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.empty-description {
  font-size: 14px;
  color: #6b7280;
}
</style>
