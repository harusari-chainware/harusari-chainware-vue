<template>
  <header class="header">
    <div class="logo-title">Chainware SCM 시스템</div>
    <nav class="top-menu">
      <a
          v-for="menu in menuList"
          :key="menu"
          href="#"
          :class="{ active: menu === selected }"
          @click.prevent="selectMenu(menu)"
      >
        {{ menu }}
      </a>
    </nav>
  </header>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const emits = defineEmits(['selectMenu'])

const props = defineProps({
  selected: String
})

const menuList = [
  '대시보드',
  '회원',
  '제품',
  '가맹점/거래처/창고',
  '주문/반품/배송',
  '품의/발주/입고',
  '폐기',
  '마이페이지'
]

const selectMenu = (menu) => {
  emits('selectMenu', menu)
}
</script>

<style scoped>
.header {
  background: #fff;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3e7ec;
}

.logo-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.top-menu {
  display: flex;
  gap: 1.5rem;
}

.top-menu a {
  text-decoration: none;
  color: #4a5662;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.top-menu a.active {
  background-color: #3aaed8;
  color: #fff;
}
</style>
