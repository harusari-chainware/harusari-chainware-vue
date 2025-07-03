<template>
  <aside class="sidebar">
    <nav class="sidebar-area">
      <SidebarSection :groups="sidebarMap[selectedMenu]" />
<!--      <SidebarSection :groups="filteredSidebarMap[selectedMenu]" />-->
    </nav>
  </aside>
</template>

<script setup>
import SidebarSection from './sidebar/SidebarSection.vue'
import { sidebarMap } from '@/constants/sidebarMap'
// import { getFilteredSidebarMap } from '@/utils/filteredSidebarMap'
import { defineProps, computed } from 'vue'

defineProps({
  selectedMenu: {
    type: String,
    required: true
  },
  // userRole : String
})

// TODO: 추후 권한 기반 사이드바 필터링 활성화
// const filteredSidebarMap = computed(() =>
//     getFilteredSidebarMap(props.userRole)
// )
</script>

<style scoped>
.sidebar {
  width: 250px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 1.5rem;
  border-right: 1px solid #e3e7ec;
}

.sidebar-area{
  margin-left: 0.3rem;
}
</style>
