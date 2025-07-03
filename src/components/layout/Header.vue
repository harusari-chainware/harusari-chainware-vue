<template>
  <header class="header">
    <div class="logo-box">
      <img :src="logo" alt="Chainware 로고" class="logo-img" />
    </div>
    <nav class="top-menu">
      <!-- 추후 a 태그 안에 v-for="menu in accessibleMenus" 추가 -->
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
import logo from '@/assets/images/chainware-logo-short.png'

import { defineEmits, defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

const emits = defineEmits(['selectMenu'])
const props = defineProps({
  selected: String,
  // userRole: String
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

// TODO: 추후 권한 기반 메뉴 노출
// const accessibleMenus = computed(() =>
//   getAccessibleHeaderMenus(props.userRole)
// )


const router = useRouter()

const routeMap = {
  '대시보드': '/dashboard/prediction',
  '회원': '/members/list',
  '제품': '/product/list',
  '가맹점/거래처/창고': '/franchise/list',
  '주문/반품/배송': '/order/list',
  '품의/발주/입고': '/requisition/list',
  '폐기': '/franchise/dispose/list',
  '마이페이지': '/mypage/info'
}

const selectMenu = (menu) => {
  emits('selectMenu', menu)
  const route = routeMap[menu]
  if (route) {
    router.push(route)
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3e7ec;
}

.logo-box {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  object-fit: contain;
  padding-left: 1rem;
}

.top-menu {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
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

.top-menu a:not(.active):hover {
  background-color: #e9f5fa;
  color: #3aaed8;
}
</style>
