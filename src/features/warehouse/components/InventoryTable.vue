<script setup>
defineProps({ items: Array })

const getQuantityClass = (item) => {
  const safety = item.safetyQuantity ?? 0
  if (item.quantity <= safety) return 'danger'
  if (item.quantity <= safety + 20) return 'warning'
  return 'normal'
}

const formatDate = (dt) => {
  const d = new Date(dt)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="table-container">
    <table class="table">
      <thead>
      <tr>
        <th>제품명</th>
        <th>제품 코드</th>
        <th>수량</th>
        <th>창고명</th>
        <th>최종 수정일</th>
        <th>작업</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.warehouseInventoryId">
        <td>{{ item.productName }}</td>
        <td>{{ item.productCode }}</td>
        <td>
          <div :class="['quantity', getQuantityClass(item)]">
            {{ item.quantity }} {{ item.unitSpec }}
          </div>
          <div class="reserved">예약: {{ item.reservedQuantity }} {{ item.unitSpec }}</div>
        </td>
        <td>{{ item.warehouseName }}</td>
        <td>{{ formatDate(item.createdAt) || formatDate(item.modifiedAt) }}</td>
        <td>
          <button class="btn-detail" @click="$emit('detail', item.warehouseInventoryId)">상세</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.quantity {
  font-weight: bold;
}
.quantity.normal {
  color: #222;
}
.quantity.warning {
  color: #f59e0b;
}
.quantity.danger {
  color: #ef4444;
}
.reserved {
  font-size: 0.75rem;
  color: #888;
}
.btn-detail {
  padding: 0.25rem 0.5rem;
  background-color: #e0e7ff;
  color: #3730a3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.table thead th {
  background-color: #f4f6fa; /* 밝은 회색/파랑 계열 */
  color: #333;
  font-weight: 600;
  font-size: 14px;
  padding: 0.75rem;
}
.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem; /* 테이블 전체 글씨 크기 축소 */
}
th, td {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.quantity {
  font-weight: 600;
}
.quantity.normal {
  color: #222;
}
.quantity.warning {
  color: #f59e0b;
}
.quantity.danger {
  color: #ef4444;
}
.reserved {
  font-size: 0.75rem;
  color: #888;
}
.btn-detail {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: #e0e7ff;
  color: #3730a3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.table thead th {
  background-color: #f4f6fa;
  color: #333;
  font-weight: 600;
  font-size: 0.85rem;
}
</style>
