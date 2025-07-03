<template>
  <aside class="sidebar">
    <div class="logo">
      <img :src="logo" alt="Chainware 로고" class="logo-img"  />
    </div>
    <nav>
      <SidebarSection :groups="sidebarMap[selectedMenu]" />
    </nav>
  </aside>
</template>

<script setup>
import SidebarSection from './sidebar/SidebarSection.vue'
import { sidebarMap } from '@/constants/sidebarMap'
import logo from '@/assets/images/chainware-logo.png';
import { defineProps } from 'vue'

defineProps({
  selectedMenu: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #fff;
  padding: 1.5rem;
  border-right: 1px solid #e3e7ec;
}

.sidebar .logo {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.sidebar .logo img {
  width: 180px;
}
</style>
