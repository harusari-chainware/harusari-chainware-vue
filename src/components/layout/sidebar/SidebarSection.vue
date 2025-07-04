<template>
  <ul class="sidebar-section">
    <SidebarGroup
        v-for="group in groups"
        :key="group.title"
        :group="group"
        :is-open="openGroups.includes(group.title)"
        @toggle="toggleGroup(group.title)"
    />
  </ul>
</template>

<script setup>
import { ref, watch } from 'vue'
import SidebarGroup from './SidebarGroup.vue'

const props = defineProps({
  groups: Array,
  default: () => []
})

const openGroups = ref(props.groups?.map(group => group.title) || [])

const toggleGroup = (title) => {
  if (openGroups.value.includes(title)) {
    openGroups.value = openGroups.value.filter(t => t !== title)
  } else {
    openGroups.value.push(title)
  }
}

watch(
    () => props.groups,
    (newGroups) => {
      openGroups.value = newGroups?.map(g => g.title) || []
    },
    { immediate: true }
)
</script>

<style scoped>
.sidebar-section {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}
</style>