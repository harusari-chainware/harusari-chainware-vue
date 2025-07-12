<template>
  <main class="register-layout">
    <!-- 상단 헤더 -->
    <section class="page-header">
      <div>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-description" v-if="description">{{ description }}</p>
      </div>
      <div class="button-group">
        <slot name="actions" />
      </div>
    </section>

    <!-- 정보 입력 (좌측만) -->
    <section class="info-section full-width">
      <section class="left-area">
        <slot name="left" />
      </section>
    </section>
  </main>
</template>

<script setup>
defineProps({
  title: String,
  description: String
})
</script>

<style scoped>
.register-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-gray-100);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  font-size: var(--font-page-title-large);
  color: var(--color-gray-900);
  margin-bottom: 10px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
}
.page-description {
  font-size: var(--font-page-description);
  color: var(--color-gray-600);
}
.button-group {
  display: flex;
  gap: 0.5rem;
}
/* 정보 입력 */
.info-section {
  display: flex;
  background-color: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}
.info-section.full-width .left-area {
  width: 100%;
}
.left-area {
  flex: 1;
  min-width: 0;
}
</style>
