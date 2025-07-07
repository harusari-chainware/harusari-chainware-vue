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

    <!-- 좌우 정보 입력 -->
    <section class="info-section" :class="{ 'full-width': !slots.right }">
      <slot name="left" />
      <section>
        <slot name="right" />
      </section>
    </section>

    <!-- 상세 정보 + 요약 -->
    <section v-if="hasDetailSlot" class="detail-section">
      <slot name="detail" />
      <slot name="summary" />
    </section>

    <!-- 하단 버튼 -->
    <section class="footer-section">
      <slot name="footer" />
    </section>
  </main>
</template>

<script setup>
import { useSlots, computed } from 'vue'

defineProps({
  title: String,
  description: String
})

const slots = useSlots()

const hasRightSlot = computed(() => !!slots.right)
const hasDetailSlot = computed(() => !!slots.detail)
</script>

<style scoped>
.register-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 3rem;
  background-color: var(--color-gray-100);
}

/* 헤더 스타일 (상세/목록 방식과 동일) */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.page-title {
  font-size: var(--font-page-title-large);
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: var(--color-gray-900);
}

.page-description {
  font-size: var(--font-page-description);
  color: var(--color-gray-600);
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

/* 좌우 정보 영역 */
.info-section {
  display: flex;
  gap: 2rem;
  transition: all 0.3s ease;
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
}
.right-area {
  flex: 1;
}

/* 상세 테이블 */
.detail-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

/* 하단 버튼 */
.footer-section {
  display: flex;
  justify-content: center;
  margin: 0;
}
</style>
