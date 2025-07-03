<template>
  <ul class="sidebar-section">
    <SidebarGroup
        v-for="group in groups"
        :key="group.title"
        :group="group"
    />
  </ul>
</template>

<script setup>
import SidebarGroup from './SidebarGroup.vue'
defineProps({ groups: Array })
</script>

<style scoped>
.sidebar-section {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>