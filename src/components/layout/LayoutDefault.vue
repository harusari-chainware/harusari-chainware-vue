<template>
  <div class="layout">
    <Header :selected="selectedMenu" @selectMenu="handleSelectMenu" />
    <div class="content">
      <h5>헤더의 {{ selectedMenu }} 칸 선택</h5>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'

const selectedMenu = ref('대시보드')
const handleSelectMenu = (menu) => {
  selectedMenu.value = menu
}
</script>
