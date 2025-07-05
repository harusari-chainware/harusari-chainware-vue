<!-- components/common/skeleton/SkeletonDetail.vue -->
<template>
  <article class="section">
    <h2 class="section-title" v-if="title">{{ title }}</h2>
    <div :class="gridClass">
      <SkeletonItem
          v-for="n in count"
          :key="n"
          :has-label="hasLabel"
          :boxed="boxed"
      />
    </div>
  </article>
</template>

<script setup>
import SkeletonItem from './SkeletonItem.vue'
import { computed } from 'vue'

const props = defineProps({
  title: String,
  count: { type: Number, default: 6 },
  columns: { type: Number, default: 1 }, // 1 or 2
  hasLabel: { type: Boolean, default: true },
  boxed: { type: Boolean, default: false }
})

const gridClass = computed(() => {
  return ['info-grid', props.columns === 2 ? 'info-grid-2' : 'info-grid-1']
})
</script>

<style>
.section {
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  min-height: 150px;
}

.section-title {
  font-size: var(--font-header, 16px);
  font-weight: bold;
  margin-bottom: 15px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
  color: var(--color-gray-900);
}

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
