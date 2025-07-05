<template>
  <article class="section">
    <!-- 블록 제목 -->
    <h2 class="section-title" v-if="title">{{ title }}</h2>

    <!-- 내부 정보 그리드 -->
    <div :class="gridClass">
      <slot />
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  columns: {
    type: Number,
    default: 1 // 1 또는 2
  }
})

const gridClass = computed(() => {
  return ['info-grid', props.columns === 2 ? 'info-grid-2' : 'info-grid-1']
})
</script>

<style scoped>
.section {
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.section-title {
  font-size: var(--font-header);
  font-weight: bold;
  margin-bottom: 15px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
  color: var(--color-gray-900);
}

/* 기본 info-grid */
.info-grid {
  display: grid;
  gap: 12px;
}

.info-grid-1 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .info-grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
