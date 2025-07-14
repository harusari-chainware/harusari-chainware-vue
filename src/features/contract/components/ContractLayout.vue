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

</style>
