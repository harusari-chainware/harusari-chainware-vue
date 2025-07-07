<!-- OrderRegisterOrderType.vue -->
<template>
  <div class="info-card">
    <ReadonlyField label="주문 종류" :value="orderType" />
  </div>
</template>

<script setup>
import ReadonlyField from '@/components/common/fields/ReadonlyField.vue'

defineProps({
  orderType: String
})
</script>
