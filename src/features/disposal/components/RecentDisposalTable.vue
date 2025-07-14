<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">최근 폐기 내역</h2>
    </div>
    <div style="overflow-x: auto">
      <table class="table" v-if="items && items.length > 0">
        <thead>
        <tr>
          <th>폐기 ID</th>
          <th>상품명</th>
          <th>수량</th>
          <th>폐기 사유</th>
          <th>폐기 유형</th>
          <th>반품코드</th>
          <th>등록일</th>
          <th>상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.disposalId">
          <td>{{ item.disposalId }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.disposalReason }}</td>
          <td>
  <span
      class="badge"
      :class="item.takeBackCode ? 'badge-return' : 'badge-normal'"
  >
    {{ item.takeBackCode ? '반품 폐기' : '일반 폐기' }}
  </span>
          </td>
          <td>{{ item.takeBackCode || '-' }}</td>
          <td>{{ item.createdAt }}</td>
          <td><span class="badge badge-success">완료</span></td>
        </tr>
        </tbody>
      </table>
      <div v-else class="text-center">폐기 내역이 없습니다.</div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
  overflow: hidden;
}

.table-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background-color: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover {
  background-color: #f9fafb;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
}

.badge-success {
  background-color: #d1fae5;
  color: #065f46;
}

.text-center {
  text-align: center;
  color: #9ca3af;
  padding: 16px;
}
.badge-normal {
  background-color: #e0f2fe; /* light blue */
  color: #0284c7;           /* blue-600 */
}

.badge-return {
  background-color: #fef3c7; /* light yellow */
  color: #b45309;            /* amber-700 */
}
</style>
