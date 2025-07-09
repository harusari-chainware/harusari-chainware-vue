producttable

<template>
  <GenericTable :items="products" :columns="columns">
    <!-- 제품코드: 3자리 패딩 -->
    <template #cell-productCode="{ value }">
      <span>{{ padProductCode(value) }}</span>
    </template>

    <!-- 카테고리명: 매핑 -->
    <template #cell-categoryName="{ value, item }">
      <span>{{ getCategoryName(item.categoryId) || '-' }}</span>
    </template>

    <!-- 보관상태 -->
    <template #cell-storeType="{ value }">
      <span>{{ value }}</span>
    </template>

    <!-- 제품상태: true/false or enum 매핑 -->
    <template #cell-productStatus="{ value }">
      <span>
        {{ value === true || value === 'ACTIVE' ? '활성' : '비활성' }}
      </span>
    </template>

    <!-- 등록일시 포맷 -->
    <template #cell-productCreatedAt="{ value }">
      <span>{{ value ? formatDate(value) : '-' }}</span>
    </template>

    <!-- 상세 버튼 -->
    <template #cell-detail="{ item }">
      <RouterLink
          :to="getDetailLink(item)"
          class="detail-link"
      >
        상세보기
      </RouterLink>
    </template>
<!--    <template #cell-detail="{ item }">-->
<!--      <button class="detail-btn" @click="$emit('detail', item)">조회</button>-->
<!--    </template>-->

  </GenericTable>
</template>

<script setup>
import { watchEffect } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'

const props = defineProps({
  products: { type: Array, required: true },
  categories: { type: Array, required: true }
})

watchEffect(() => {
  props.products.forEach(prod => {
    const found = props.categories.some(top =>
        (top.categories || []).some(cat => String(cat.categoryId) === String(prod.categoryId))
    )
    if (!found) {
      console.warn('매칭되는 카테고리 없음! productId:', prod.productId, 'categoryId:', prod.categoryId)
      console.log('현재 카테고리 목록:', props.categories.map(top => ({
        topCategoryId: top.topCategoryId,
        topCategoryName: top.topCategoryName,
        categories: (top.categories || []).map(cat => cat.categoryId)
      })))
    }
  })
})

props.products.forEach(prod => {
  const found = props.categories.some(top =>
      (top.categories || []).some(cat => String(cat.categoryId) === String(prod.categoryId))
  )
  if (!found) {
    console.warn('매칭되는 카테고리 없음! productId:', prod.productId, 'categoryId:', prod.categoryId)
  }
})

console.log('products:', JSON.parse(JSON.stringify(props.products)))
console.log('topCategories:', JSON.parse(JSON.stringify(props.categories)))

const columns = [
  { key: 'productId', label: '제품 ID', align: 'center' },
  { key: 'productCode', label: '제품코드', align: 'center' },
  { key: 'productName', label: '제품명', align: 'center' },
  { key: 'categoryName', label: '카테고리명', align: 'center' },
  { key: 'basePrice', label: '단가', align: 'center' },
  { key: 'storeType', label: '보관상태', align: 'center' },
  { key: 'productStatus', label: '제품상태', align: 'center' },
  { key: 'productCreatedAt', label: '등록 일시', align: 'center' },
  { key: 'detail', label: '상세', align: 'center' }
]

// const getDetailLink = (item) => {
//     return `/product/${item.categoryId}`
// }

// 숫자 패딩 함수
function padProductCode(productCode) {
  if (!productCode) return "";
  const parts = productCode.split('-');
  if (parts.length !== 3) return productCode;
  const num = parts[2].padStart(3, '0');
  return `${parts[0]}-${parts[1]}-${num}`;
}

const getDetailLink = (item) => {
  return `/product/${item.productId}` // 상품 상세라면 productId로!
}

const getCategoryName = (categoryId) => {
  for (const top of props.categories) {
    // const found = (top.categories || []).find(cat => cat.categoryId === categoryId)
    const found = (top.categories || []).find(cat => String(cat.categoryId) === String(categoryId))
    if (found) {
      // 상위카테고리명 > 카테고리명
      return `${top.topCategoryName || top.categoryName || '-'} / ${found.categoryName}`;
    }
  }
  // 상위만 있는 경우
  // const topOnly = props.categories.find(tc => tc.topCategoryId === categoryId);
  // if (topOnly) return topOnly.topCategoryName || topOnly.categoryName || '';
  // return '';
  const topOnly = props.categories.find(tc => String(tc.topCategoryId) === String(categoryId));
  if (topOnly) return topOnly.topCategoryName || topOnly.categoryName || '';
  return '-';
}

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      + ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.detail-btn {
  background: var(--color-primary, #43b3e0);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  height: 34px;
  padding: 0 16px;
  cursor: pointer;
}
.detail-btn:hover { background: var(--color-primary-dark, #1599c6); }
</style>
