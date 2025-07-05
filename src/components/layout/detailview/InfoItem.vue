<template>
  <div class="info-item">
    <div class="info-label">
      <slot name="label" />
    </div>
    <div class="info-values">
      <slot name="value" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  boxed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.6;
  margin-left: 10px;
}

/* 라벨 */
.info-label {
  color: var(--color-gray-600);
  font-weight: 500;
  font-size: var(--font-info-label);
  min-width: 100px; /* 고정 너비 지정 시 정렬 안정화 */
  flex-shrink: 0;
}

/* value wrapper */
.info-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--font-info-value);
  color: var(--color-gray-900);
  align-items: center;
}

/* 박스형 value 적용 시 */
.info-values:has(.info-text) {
  flex-wrap: wrap;
}
</style>