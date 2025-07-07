<template>
  <section class="section">
    <h2 class="section-title" v-if="title">{{ title }}</h2>

    <GenericTable :columns="columns" :items="items">
      <!-- 커스텀 셀 슬롯이 있는 경우 자동 바인딩 -->
      <template
          v-for="col in columns"
          :key="col.key"
          v-slot:[`cell-${col.key}`]="slotProps"
      >
        <slot :name="`cell-${col.key}`" v-bind="slotProps" />
      </template>
    </GenericTable>

    <!-- 추가 액션 영역 (더보기, 페이지네이션 등) -->
    <div v-if="$slots.footer" class="table-footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script setup>
import GenericTable from '@/components/common/GenericTable.vue'

defineProps({
  title: String,
  items: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.section {
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: var(--font-header);
  font-weight: bold;
  margin-bottom: 15px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
  color: var(--color-gray-900);
}

.table-footer {
  margin-top: 1rem;
}
</style>
