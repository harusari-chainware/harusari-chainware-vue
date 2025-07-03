<template>
  <div class="layout-default">
    <!-- 권한에 따른 분기처리를 위해 추후 사이드바와 헤더 안에 :userRole="userRole" 추가-->

    <!-- 위에 헤더 -->
    <Header
        :selected="selectedMenu"
        @selectMenu="handleSelectMenu"
    />

    <!-- 아래: 사이드바 + 메인 콘텐츠 -->
    <div class="body-wrapper">
      <Sidebar class="sidebar" :selectedMenu="selectedMenu" />
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
  border-right: 1px solid #e3e7ec;
  padding: 1rem 1.5rem;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  background-color: #fff;
}
</style>
