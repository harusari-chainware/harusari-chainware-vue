<template>
  <div class="sidebar-group">
    <div class="menu-title">
      <span class="icon-wrapper">
        <i :class="group.icon" class="menu-icon" />
      </span>
      <span class="menu-text">{{ group.title }}</span>
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

/* 아이콘 감싸는 wrapper: 고정 폭, 정렬 */
.icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;  /* 고정 가로폭 */
  min-width: 20px;
  margin-right: 0.5rem;
}

/* 아이콘 자체 스타일 */
.menu-icon {
  font-size: 1rem;
  width: 1rem;
  text-align: center;
}
</style>