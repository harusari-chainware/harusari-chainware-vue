<template>
  <main class="detail-layout">
    <!-- 제목 + 액션 버튼 -->
    <section class="page-header">
      <div>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-description" v-if="description">{{ description }}</p>
      </div>
      <div class="button-group">
        <slot name="actions" />
      </div>
    </section>

    <!-- 기본 정보 섹션 -->
    <section class="basic-info" :class="$attrs.class">
      <slot name="basic" />
    </section>

    <!-- 상세 정보 섹션 -->
    <section class="detail-info">
      <slot name="detail" />
    </section>
  </main>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.detail-layout {
  padding: 1rem;
  background-color: var(--color-gray-100);
  overflow-y: auto;
}

/* 제목 영역 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: var(--font-page-title-large);
  font-weight: bold;
  color: var(--color-gray-900);
  margin-bottom: 4px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
}

.page-description {
  font-size: var(--font-page-description);
  color: var(--color-gray-600);
}

.button-group {
  display: flex;
  gap: 10px;
}

/* 섹션 구조 */
/* scoped style */
.basic-info {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .basic-info.grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
