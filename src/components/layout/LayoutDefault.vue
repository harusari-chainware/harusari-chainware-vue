<template>
  <div class="layout-default">
    <!-- 권한에 따른 분기처리를 위해 추후 사이드바와 헤더 안에 :userRole="userRole" 추가-->

    <!-- 좌측 사이드바 -->
    <Sidebar class="sidebar" :selectedMenu="selectedMenu" />

    <!-- 우측 헤더 + 페이지 -->
    <div class="content-wrapper">
      <Header
          :selected="selectedMenu"
          @selectMenu="handleSelectMenu"
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
import { ref } from 'vue'

const selectedMenu = ref('대시보드')

// TODO: 추후 백엔드 연동 시 사용자 권한 값 주입
// const userRole = 'FRANCHISE_MANAGER'

const handleSelectMenu = (menu) => {
  selectedMenu.value = menu
}
</script>

<style scoped>
.layout-default {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f9f9f9;
  overflow: hidden;
}

/* 사이드바 고정 */
.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #e3e7ec;
  padding: 1rem 1.5rem;
}

/* 오른쪽 전체 */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 헤더는 위 */
.content-wrapper > header {
  background: #fff;
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3e7ec;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  background-color: #fff;
}
</style>
