<template>
  <div class="footer">
    <slot name="actions" />
  </div>
</template>

<script setup>
// 등록/취소/초기화 버튼 삽입을 위한 공통 하단 레이아웃
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>