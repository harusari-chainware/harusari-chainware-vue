<template>
  <header class="header">
    <div class="logo-box">
      <a href="/" @click.prevent="reloadPage">
        <img :src="logo" alt="Chainware 로고" class="logo-img" />
      </a>
    </div>

    <nav class="top-menu">
      <!-- 추후 a 태그 안에 v-for="menu in accessibleMenus" 추가 -->
      <a
          v-for="menu in menuList"
          :key="menu"
          href="#"
          :class="{ active: menu === selected }"
          @click.prevent="handleClick(menu)"
      >
        {{ menu }}
      </a>

      <!-- 마이페이지 전용 -->
      <div class="top-menu-item" ref="mypageRef">
        <a
            href="#"
            class="mypage-menu"
            :class="{
            active: isMypageRoute,
            'mypage-active': showMypageDropdown
          }"
            @click.prevent="toggleMypageDropdown"
        >
          마이페이지
        </a>
        <div v-if="showMypageDropdown" class="dropdown">
          <a @click="goToMypage">내 정보 조회</a>
          <a @click="logout">로그아웃</a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import logo from '@/assets/images/chainware-logo-short.png'
import { ref, defineEmits, defineProps, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const emits = defineEmits(['selectMenu'])
const props = defineProps({
  selected: String
})

const reloadPage = () => {
  window.location.href = '/'
}

const menuList = [
  '대시보드',
  '회원',
  '제품',
  '가맹점/거래처/창고',
  '주문/반품/배송',
  '품의/발주/입고',
  '폐기'
]

// TODO: 추후 권한 기반 메뉴 노출
// const accessibleMenus = computed(() =>
//   getAccessibleHeaderMenus(props.userRole)
// )


const router = useRouter()
const route = useRoute()

const showMypageDropdown = ref(null)
const mypageRef = ref(null)

const routeMap = {
  '대시보드': '/dashboard/prediction',
  '회원': '/member/list',
  '제품': '/product/list',
  '가맹점/거래처/창고': '/franchise/list',
  '주문/반품/배송': '/order/list',
  '품의/발주/입고': '/requisition/list',
  '폐기': '/disposal/franchise/list'
}

const isMypageRoute = computed(() => route.path.startsWith('/mypage'))

const handleClick = (menu) => {
  emits('selectMenu', menu)
  showMypageDropdown.value = false
  const routePath = routeMap[menu]
  if (routePath) router.push(routePath)
}

const toggleMypageDropdown = () => {
  showMypageDropdown.value = !showMypageDropdown.value
}

const goToMypage = () => {
  emits('selectMenu', '마이페이지')
  showMypageDropdown.value = false
  router.push('/mypage/info')
}

const logout = () => {
  showMypageDropdown.value = false
  // TODO: 실제 로그아웃 로직 (토큰 삭제, 상태 초기화 등)
  alert('로그아웃 되었습니다')
  // router.push('/login')
}

const handleClickOutside = (event) => {
  if (mypageRef.value && !mypageRef.value.contains(event.target)) {
    showMypageDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  height: 60px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-light);
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
  align-items: center;
}

.top-menu a {
  text-decoration: none;
  color: var(--color-gray-700);
  font-size: var(--font-header);
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.top-menu a.active {
  background-color: var(--color-primary);
  color: #fff;
}

.top-menu a:not(.active):hover {
  background-color: var(--color-primary-light);
  color: 	var(--color-primary);
}

.top-menu a.active,
.mypage-menu.active {
  background-color: var(--color-primary);
  color: #fff;
}

.top-menu-item {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown {
  position: absolute;
  top: 2.3rem;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 140px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.dropdown a {
  padding: 0.6rem 1rem;
  text-decoration: none;
  color: #333;
  font-size: var(--font-header-dropdown);
}

.dropdown a:hover {
  background-color: var(--color-hover-dark);
}

.mypage-menu {
  text-decoration: none;
  color: var(--color-gray-700);
  font-size: var(--font-header);
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.mypage-menu.mypage-active {
  background-color: #c3e9f5;
  color: var(--color-primary-dark);
}
</style>
