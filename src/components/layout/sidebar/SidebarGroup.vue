<template>
  <div class="sidebar-group">
    <div class="menu-title">
      <i :class="group.icon" class="menu-icon" /> {{ group.title }}
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
  display: flex;
  align-items: center;
}

.menu-icon {
  margin-right: 0.5rem;
}
</style>