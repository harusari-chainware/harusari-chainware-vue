<template>
  <div class="right-panel">
    <slot />
  </div>
</template>

<script setup>
// 검색 확장 패널 영역을 위한 공통 레이아웃
</script>

<style scoped>
.right-panel {
  width: 100%;
  background: var(--color-white);
  padding: 1.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}
</style>