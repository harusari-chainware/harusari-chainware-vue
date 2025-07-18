<template>
  <div class="layout-default">
    <!-- 위에 헤더 -->
    <Header
        :selected="selectedMenu"
        @selectMenu="handleSelectMenu"
    />

    <!-- 아래: 사이드바 + 메인 콘텐츠 -->
    <div class="body-wrapper">
      <Sidebar
          class="sidebar"
          :selectedMenu="selectedMenu"
          :userRole="userStore.authority"
      />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {useAuthStore} from "@/features/auth/useAuthStore.js";

const route = useRoute()
const selectedMenu = ref('')

const userStore = useAuthStore()
const userRole = userStore.authority

const routeToMenuMap = [
  { path: '/dashboard', menu: '대시보드' },
  { path: '/member', menu: '회원' },
  { path: '/category', menu: '제품' },
  { path: '/product', menu: '제품' },
  { path: '/contract', menu: '제품' },
  { path: '/franchise', menu: '거래처/창고' },
  // { path: '/franchise', menu: '가맹점' },
  { path: '/vendor', menu: '거래처/창고' },
  { path: '/warehouse', menu: '거래처/창고' },
  { path: '/disposal', menu: '폐기' },
  { path: '/order', menu: '주문/반품' },
  { path: '/takeback', menu: '주문/반품' },
  // { path: '/delivery', menu: '주문/반품' },
  { path: '/requisition', menu: '품의/발주' },
  { path: '/purchase', menu: '품의/발주' },
  { path: '/stockin', menu: '품의/발주' },
  { path: '/mypage', menu: '마이페이지' }
]

const syncSelectedMenuWithRoute = () => {
  const matched = routeToMenuMap.find(item => route.path.startsWith(item.path))
  selectedMenu.value = matched ? matched.menu : ''
}

onMounted(() => {
  syncSelectedMenuWithRoute()
})

watch(() => route.path, () => {
  syncSelectedMenuWithRoute()
})

const handleSelectMenu = (menu) => {
  selectedMenu.value = menu
}
</script>

<style scoped>
.layout-default {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: var(--color-gray-50);
  flex-direction: column;
  overflow: hidden;
}

/* 고정 높이의 헤더 */
.layout-default > header {
  height: 60px;
  background: #fff;
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

/* 헤더 아래 콘텐츠 바디: 사이드바 + 메인 */
.body-wrapper {
  display: flex;
  flex: 1;
  height: calc(100vh - 60px); /* 헤더 제외 전체 높이 */
  overflow: hidden;
}

/* 사이드바  */
.sidebar {
  box-sizing: border-box;
  width: 240px;
  background-color: #fff;
  border-right: 1px solid var(--color-border-light);
  padding: 1rem 1.5rem;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  background-color: var(--color-gray-100);
}
</style>
