<template>
  <div class="skeleton-item">
    <div v-if="hasLabel" class="skeleton-label shimmer" />
    <div class="skeleton-value shimmer" :class="{ boxed }" />
  </div>
</template>

<script setup>
defineProps({
  hasLabel: {
    type: Boolean,
    default: true
  },
  boxed: {
    type: Boolean,
    default: false
  }
})
</script>

<!-- scoped 제거됨 -->
<style>
.skeleton-item {
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 8px;
  margin-bottom: 4px;
}

/* 배경색 + 쉬머 대상 */
.skeleton-label,
.skeleton-value {
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

/* 크기 지정 */
.skeleton-label {
  width: 100px;
  height: 14px;
}

.skeleton-value {
  height: 16px;
  width: 100%;
}

.skeleton-value.boxed {
  width: 120px;
}

/* 쉬머 효과 */
.shimmer::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}
</style>
