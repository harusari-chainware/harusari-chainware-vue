<template>
  <table class="product-table">
    <thead>
    <tr>
      <th>제품 코드</th>
      <th>제품명</th>
      <th>단위</th>
      <th>수량</th>
      <th>가격</th>
      <th>반품 사유</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="p in products" :key="p.productId">
      <td>{{ p.code }}</td>
      <td>{{ p.name }}</td>
      <td>{{ p.unit }}</td>
      <td>{{ p.quantity }}</td>
      <td>{{ p.price.toLocaleString() }}원</td>
      <td>{{ p.reason }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({ products: Array })
</script>

<style scoped>
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
</style>
