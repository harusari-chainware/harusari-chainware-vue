<template>
  <div class="sidebar-group">
    <div class="menu-title" @click="emitToggle">
      <span class="arrow-wrapper">
        <i :class="isOpen ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'" class="arrow-icon" />
      </span>
      <span class="icon-wrapper">
        <i :class="group.icon" class="menu-icon" />
      </span>
      <span class="menu-text">{{ group.title }}</span>
    </div>
    <SidebarItemList v-if="isOpen" :items="group.items" />
  </div>
</template>

<script setup>
import SidebarItemList from './SidebarItemList.vue'

defineProps({
  group: Object,
  isOpen: Boolean
})

const emit = defineEmits(['toggle'])

const emitToggle = () => {
  emit('toggle')
}
</script>

<style scoped>
.menu-title {
  font-weight: 600;
  color: #3aaed8;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.arrow-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  min-width: 14px;
  margin-right: 0.2rem;
}

.arrow-icon {
  font-size: 0.7rem;
}

.icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  min-width: 20px;
  margin-right: 0.5rem;
}

.menu-icon {
  font-size: 1rem;
  width: 1rem;
  text-align: center;
}
</style>