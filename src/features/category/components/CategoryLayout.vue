
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

        <!-- #basic 슬롯(카드 내부 전체 렌더링용) -->
        <section class="form-card">
          <slot name="basic" />
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
.detail-layout {
  padding: 1rem;
  background: var(--color-gray-100);
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

.button-group {
  display: flex;
  gap: 10px;
}

.form-card {
  gap: 2rem;
  transition: all 0.3s ease;
  background-color: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  margin: 40px auto 0 auto;
  width: 100%;
}

</style>
