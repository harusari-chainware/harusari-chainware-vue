<template>
  <GenericTable :items="contracts" :columns="columns">
    <!-- No 컬럼 -->
<!--    <template #cell-no="{ index }">-->
<!--      {{ index + 1 }}-->
<!--    </template>-->
    <template #cell-no="{ index }">
      {{ totalCount - ((page - 1) * pageSize) - index }}
    </template>

    <!-- 기본 단가, 계약 단가, 최소 발주 수량 등 숫자 포맷 가능 -->
    <template #cell-basePrice="{ value }">
      {{ formatNumber(value) }}
    </template>
    <template #cell-contractPrice="{ value }">
      {{ formatNumber(value) }}
    </template>
    <template #cell-minOrderQty="{ value }">
      {{ formatNumber(value) }}
    </template>
    <!-- 날짜 포맷 -->
    <template #cell-contractStartDate="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #cell-contractEndDate="{ value }">
      {{ formatDate(value) }}
    </template>
    <!-- 계약 상태 뱃지 -->
    <template #cell-contractStatus="{ value }">
      <span :class="['contract-status-badge', value === 'ACTIVE' ? 'active' : 'expired']">
        {{ value === 'ACTIVE' ? '활성' : '만료' }}
      </span>
    </template>
    <!-- 조회된 데이터 없음 메시지 -->
    <template #body>
      <tr v-if="!contracts || contracts.length === 0">
        <td :colspan="columns.length" class="empty-msg">조회된 데이터가 없습니다.</td>
      </tr>
    </template>

    <!-- 상세 버튼 -->
    <template #cell-detail="{ item }">
      <RouterLink
          :to="getDetailLink(item)"
          class="detail-link"
      >   상세보기
      </RouterLink>
    </template>

  </GenericTable>
</template>

<script setup>
import GenericTable from "@/components/common/GenericTable.vue"

const props = defineProps({
  contracts: { type: Array, required: true },
  totalCount: { type: Number, required: true },
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true }
})

const columns = [
  { key: 'no', label: 'No', align: 'center' },
  { key: 'vendorName', label: '거래처명', align: 'center' },
  { key: 'productName', label: '제품명', align: 'center' },
  { key: 'basePrice', label: '기본 단가', align: 'right' },
  { key: 'contractPrice', label: '계약 단가', align: 'right' },
  { key: 'minOrderQty', label: '최소 발주 수량', align: 'right' },
  { key: 'leadTime', label: '납기일', align: 'center' },
  { key: 'contractStatus', label: '계약 상태', align: 'center' },
  { key: 'contractStartDate', label: '계약 시작일', align: 'center' },
  { key: 'contractEndDate', label: '계약 종료일', align: 'center' },
  { key: 'detail', label: '상세', align: 'center' }
]

// 숫자 포맷
function formatNumber(val) {
  if (val == null || val === "") return '-'
  return Number(val).toLocaleString()
}

// 날짜 포맷 (YYYY-MM-DD → YYYY.MM.DD)
function formatDate(val) {
  if (!val) return ''
  if (val.length === 10) return val.replace(/-/g, '.')
  return val.split('T')[0]?.replace(/-/g, '.') || val
}

const getDetailLink = (item) => {
  return `/contract/${item.contractId}`
}

</script>

<style scoped>
/* 계약상태 뱃지 스타일 */
.contract-status-badge {
  display: inline-block;
  min-width: 52px;
  padding: 4px 18px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1em;
  text-align: center;
  border: none;
}

.contract-status-badge.active {
  background: #eaf7fd;
  color: #2cb2f0;
}

.contract-status-badge.expired {
  background: #fbeaea;
  color: #e04a4a;
}

.detail-link {
  color: #43b3e0;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}
.detail-link:hover {
  color: #143a6d;
}
.empty-msg {
  text-align: center;
  color: #b0b0b0;
  padding: 30px 0;
  font-size: 1.1rem;
}

.empty-msg {
  text-align: center;
  color: #b0b0b0;
  padding: 30px 0;
  font-size: 1.1rem;
}
</style>
