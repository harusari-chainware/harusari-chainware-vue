<template>
  <GenericTable :items="categories" :columns="columns">
    <!-- 카테고리명: 하위 카테고리 없는 경우 대시 처리 -->
    <template #cell-categoryName="{ value, item }">
      <!-- 요약 행일 경우 -->
      <span v-if="item.isSummary">-</span>

      <!-- 진짜 하위 카테고리 없음 -->
      <span v-else-if="!item.categoryId" class="text-gray-400">하위 카테고리 없음</span>

      <!-- 일반 카테고리 -->
      <span v-else>{{ value }}</span>
    </template>

    <template #cell-createdAt="{ value }">
      <span>{{ value ? formatDate(value) : '-' }}</span>
    </template>
    <template #cell-modifiedAt="{ value }">
      <span>{{ value ? formatDate(value) : '-' }}</span>
    </template>

    <!-- 제품 수: 하위 없음 처리 -->
    <template #cell-productCount="{ item }">
      {{ item.productCount}}
    </template>

    <!-- 수정 버튼 -->
    <template #cell-edit="{ item }">
      <button
          class="action-btn"
          @click="$emit('edit', item, item.categoryId ? 'SUB' : 'TOP')"
      >
        수정
      </button>
    </template>

    <!-- 삭제 버튼 -->
    <template #cell-delete="{ item }">
      <button
          class="action-btn red"
          @click="$emit('delete', item)"
      >
        삭제
      </button>
    </template>

    <!-- 상세보기 -->
    <template #cell-detail="{ item }">
      <RouterLink
          :to="getDetailLink(item)"
          class="detail-link"
      >
        상세보기
      </RouterLink>
    </template>

  </GenericTable>
</template>

<script setup>
import GenericTable from '@/components/common/GenericTable.vue'

defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

// 열 정의
const columns = [
  // { key: 'no', label: 'No', align: 'center', format: (_, __, index) => index + 1 },
  { key: 'no', label: 'No', align: 'center' },
  { key: 'topCategoryName', label: '상위 카테고리명', align: 'center' },
  { key: 'categoryName', label: '카테고리명', align: 'center' },
  { key: 'productCount', label: '제품 수', align: 'center' },
  { key: 'createdAt', label: '등록 일시', align: 'center' },
  { key: 'modifiedAt', label: '수정 일시', align: 'center' },
  { key: 'edit', label: '수정', align: 'center' },
  { key: 'delete', label: '삭제', align: 'center' },
  { key: 'detail', label: '상세', align: 'center' }
]

const getDetailLink = (item) => {
  const name = item.categoryName?.trim()
  if (!name || name === '-' || name === '하위 카테고리 없음') {
    return `/category/top/${item.topCategoryId}`
  } else {
    return `/category/${item.categoryId}`
  }
}

// 날짜 포맷터
function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      + ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-gray-200);
}
thead tr {
  background-color: var(--color-gray-100);
}
tbody tr:hover {
  background-color: var(--color-gray-50);
}
.detail-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}
.detail-link:hover {
  text-decoration: underline;
}

.action-btn {
  min-width: 44px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.15s;
  background: #f5f7fa;
  color: #357ae8;
  border-color: #357ae8;
  margin: 0 2px;
}
.action-btn:hover {
  background: #e3eefd;
  color: #185adf;
  border-color: #357ae8;
  box-shadow: 0 1px 4px rgba(53, 122, 232, 0.09);
}

.action-btn.red {
  background: #fff5f5;
  color: #df2121;
  border: 1px solid #f7cccc;
}
.action-btn.red:hover {
  background: #ffe5e5;
  color: #a30c0c;
  border-color: #df2121;
  box-shadow: 0 1px 4px rgba(223,33,33,0.07);
}
</style>