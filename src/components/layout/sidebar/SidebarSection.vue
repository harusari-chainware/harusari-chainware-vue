<template>
  <ul>
    <li
        v-for="group in groups"
        :key="group.title"
    >
      <SidebarGroup :group="group" />
    </li>
  </ul>
</template>

<script setup>
import SidebarGroup from './SidebarGroup.vue'

defineProps({
  groups: Array
})
</script>
