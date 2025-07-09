
<template>
  <InfoGroup title="반려 사유">
    <div class="reject-reason-box">
      {{ reason }}
    </div>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'

defineProps({
  reason: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.reject-reason-box {
  padding: 1rem;
  background-color: var(--color-gray-100);
  border-radius: 6px;
  color: #333;
  font-size: var(--font-info-value);
}
</style>
