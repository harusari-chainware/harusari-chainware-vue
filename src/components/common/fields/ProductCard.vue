<!-- components/common/ProductCard.vue -->
<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  clickable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  if (props.clickable) emit('select', props.product)
}
</script>

<template>
  <div class="product-card" @click="handleClick">
    <div class="title">{{ product.name }}</div>
    <div class="info">
      <span>단가: {{ product.unitPrice.toLocaleString() }}원</span>
      <span>계약 수량: {{ product.availableQuantity }}</span>
    </div>
  </div>
</template>


<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.product-card:hover {
  background-color: #f9f9f9;
}
.title {
  font-weight: bold;
}
.info {
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}
</style>
