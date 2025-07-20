<script setup>
import { ref, watch } from 'vue'
import { fetchTakeBacks } from '../api.js'

const props = defineProps({
  orderNumber: String,
  productName: String,
  franchiseName: String,
  warehouseName: String,
  takeBackStatus: String,
  fromDate: String,
  toDate: String,
  page: Number,
  size: Number,
  reloadSignal: Number // ✅ 새로 추가
})

const emit = defineEmits(['update:totalElements'])

const tableData = ref([])
const totalElements = ref(0)

const fetchData = async () => {
  const rawParams = {
    orderNumber: props.orderNumber,
    productName: props.productName,
    franchiseName: props.franchiseName,
    warehouseName: props.warehouseName,
    takeBackStatus: props.takeBackStatus,
    fromDate: props.fromDate,
    toDate: props.toDate,
    page: props.page,
    size: props.size
  }

  const filteredParams = Object.fromEntries(
      Object.entries(rawParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
  )

  try {
    const { data } = await fetchTakeBacks(filteredParams)
    tableData.value = data.data?.contents ?? []
    totalElements.value = data.data?.totalElements ?? 0
    emit('update:totalElements', totalElements.value)
  } catch (err) {
    console.error('📛 fetchTakeBacks error:', err)
    tableData.value = []
    totalElements.value = 0
  }
}

watch(
    () => JSON.stringify([
      props.orderNumber,
      props.productName,
      props.franchiseName,
      props.takeBackStatus,
      props.fromDate,
      props.toDate,
      props.page,
      props.size,
      props.reloadSignal // ✅ 추가됨
    ]),
    fetchData,
    { immediate: true }
)

const statusMap = {
  REQUESTED: { text: '요청됨', class: 'status-requested' },
  COLLECTED: { text: '수거됨', class: 'status-collected' },
  APPROVED: { text: '승인됨', class: 'status-approved' },
  REJECTED: { text: '반려됨', class: 'status-rejected' },
  CANCELED: { text: '취소됨', class: 'status-canceled' }
}

const formatDate = (str) => {
  const d = new Date(str)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
</script>

<template>
  <div class="table-container">
    <table class="table w-full">
      <thead>
      <tr>
        <th>반품 ID</th>
        <th>반품 코드</th>
        <th>가맹점명</th>
        <th>창고명</th>
        <th>상태</th>
        <th>신청일</th>
        <th>작업</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="tableData.length === 0">
        <td colspan="7" class="text-center p-4">검색 결과가 없습니다.</td>
      </tr>
      <tr v-for="item in tableData" :key="item.takeBackId">
        <td>{{ item.takeBackId }}</td>
        <td>{{ item.takeBackCode }}</td>
        <td>{{ item.franchiseName }}</td>
        <td>{{ item.warehouseName }}</td>
        <td>
          <div class="status-badge" :class="statusMap[item.takeBackStatus]?.class">
            <span class="status-badge-dot" />
            <span>{{ statusMap[item.takeBackStatus]?.text }}</span>
          </div>
        </td>
        <td>{{ formatDate(item.createdAt) }}</td>
        <td>
          <RouterLink :to="`/takeback/detail/${item.takeBackId}`" class="action-btn action-btn-view">상세</RouterLink>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}
.table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}
.table tbody tr:hover {
  background-color: #f9fafb;
}
.action-btn-view {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  color: #4f46e5;
  background-color: rgba(79, 70, 229, 0.1);
  text-decoration: none;
}
.action-btn-view:hover {
  background-color: #4f46e5;
  color: white;
}

/* 상태 배지 스타일 */
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
.status-requested {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}
.status-requested .status-badge-dot {
  background-color: #3b82f6;
}
.status-collected {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}
.status-collected .status-badge-dot {
  background-color: #f59e0b;
}
.status-approved {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.status-approved .status-badge-dot {
  background-color: #10b981;
}
.status-rejected {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.status-rejected .status-badge-dot {
  background-color: #ef4444;
}
.status-canceled {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}
.status-canceled .status-badge-dot {
  background-color: #6b7280;
}
</style>
