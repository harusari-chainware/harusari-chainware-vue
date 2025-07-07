<template>
  <h2 class="section-title" v-if="title">{{ title }}</h2>
  <section class="section">
    <GenericTable :columns="columns" :items="items">
      <template
          v-for="col in columns"
          :key="col.key"
          v-slot:[`cell-${col.key}`]="slotProps"
      >
        <slot :name="`cell-${col.key}`" v-bind="slotProps" />
      </template>
    </GenericTable>

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
.section-title {
  font-size: var(--font-page-title-midium);
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
