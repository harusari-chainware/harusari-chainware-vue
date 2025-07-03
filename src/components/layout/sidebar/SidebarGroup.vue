<template>
  <div class="sidebar-group">
    <div class="menu-title">
      <i class="fas fa-caret-right"></i> {{ group.title }}
    </div>
    <SidebarItemList :items="group.items" />
  </div>
</template>

<script setup>
import SidebarItemList from './SidebarItemList.vue'

defineProps({
  group: Object
})
</script>

<style scoped>
.menu-title {
  font-weight: 600;
  color: #3aaed8;
  margin-bottom: 0.5rem;
}
</style>
