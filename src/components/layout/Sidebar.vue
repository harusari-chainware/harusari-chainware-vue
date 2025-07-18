<template>
  <aside class="sidebar">
    <nav class="sidebar-area">
      <SidebarSection :groups="filteredSidebar[selectedMenu]" />
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import SidebarSection from './sidebar/SidebarSection.vue'
import { getFilteredSidebarMap } from '@/utils/filteredSidebarMap'

const props = defineProps({
  selectedMenu: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  }
})

const filteredSidebar = computed(
    () => getFilteredSidebarMap(props.userRole)
)
</script>

<style scoped>
.sidebar {
  width: 250px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 1.5rem;
  border-right: 1px solid var(--color-border-light);
}

.sidebar-area {
  margin-left: 0.3rem;
}
</style>
