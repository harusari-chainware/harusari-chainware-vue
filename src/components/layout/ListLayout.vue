<template>
  <main>
    <!-- page-header -->
    <section class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-description">{{ description }}</p>
    </section>

    <!-- filters-section -->
    <ListFiltersSection>
      <slot name="filters" />
    </ListFiltersSection>

    <!-- top-actions -->
    <ListTopActions>
      <template #left>
        <slot name="top-actions-left" />
      </template>
      <template #right>
        <slot name="top-actions-right" />
      </template>
    </ListTopActions>

    <!-- table-section -->
    <ListTableSection>
      <slot name="table" />
    </ListTableSection>
  </main>
</template>

<script setup>
import ListFiltersSection from "@/components/layout/listview/ListFiltersSection.vue";
import ListTopActions from "@/components/layout/listview/ListTopActions.vue";
import ListTableSection from "@/components/layout/listview/ListTableSection.vue";

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
main {
  padding: 1rem;
  overflow-y: auto;
}

/* page-header */
.page-title {
  font-size: 1.5rem;
  color: var(--color-gray-900);
  margin-bottom: 10px;
  border-left: 4px solid var(--color-primary);
  padding-left: 10px;
}
.page-description {
  color: var(--color-gray-600);
  font-size: 1rem;
}
</style>
