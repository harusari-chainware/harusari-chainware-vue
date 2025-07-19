<template>
    <header class="header">
        <div class="logo-box">
            <a href="/" @click.prevent="reloadPage">
                <img :src="logo" alt="Chainware 로고" class="logo-img"/>
            </a>
        </div>

        <nav class="top-menu">
            <a
                    v-for="menu in accessibleMenus"
                    :key="menu.label"
                    href="#"
                    :class="{ active: menu.label === selected }"
                    @click.prevent="handleClick(menu.label)"
            >
                {{ menu.label }}
            </a>

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
                    <a @click="goToMypage">
                        <i class="fas fa-user"></i> 내 정보 조회
                    </a>
                    <a @click="logout">
                        <i class="fas fa-sign-out-alt"></i> 로그아웃
                    </a>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import logo from '@/assets/images/chainware-logo-short.png'
import {ref, computed, onMounted, onBeforeUnmount, defineProps, defineEmits} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from '@/features/auth/useAuthStore.js'
import {logoutApi} from '@/features/auth/api.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

const props = defineProps({
    selected: String
})
const emits = defineEmits(['selectMenu'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const userRole = computed(() => authStore.authority || '')

const showMypageDropdown = ref(false)
const mypageRef = ref(null)

const reloadPage = () => {
    switch (userRole.value) {
        case 'MASTER':
            router.push('/member/list')
            break

        case 'GENERAL_MANAGER':
        case 'SENIOR_MANAGER':
        case 'SUPER_ADMIN':
            router.push('/dashboard/prediction')
            break
        case 'VENDOR_MANAGER':
            router.push('/vendor/list')
            break
        case 'WAREHOUSE_MANAGER':
            router.push('/purchases/list')
            break
        case 'FRANCHISE_MANAGER':
            router.push('/order/list')
            break
        default:
            router.push('/login')
    }
}

// 전체 메뉴 목록
/*
MASTER
GENERAL_MANAGER
SENIOR_MANAGER
WAREHOUSE_MANAGER
FRANCHISE_MANAGER
VENDOR_MANAGER
SYSTEM
SUPER_ADMIN
*/
console.log('현재 유저 권한:', userRole.value)

const allMenus = [
    {
        label: '대시보드',
        route: '/dashboard/prediction',
        roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'SUPER_ADMIN']
    },
    {
        label: '회원',
        route: '/member/list',
        roles: ['MASTER', 'SUPER_ADMIN']
    },

    {
        label: '제품',
        route: '/product/list',
        roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER', 'SUPER_ADMIN']
    },
    {
        label: '제품',
        route: '/contract/list',
        roles: ['VENDOR_MANAGER']
    },

    {
        label: '거래처/창고',
        route: '/vendor/list',
        roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'SUPER_ADMIN'],
        group: 'franchise'
    },
    // {
    //   label: '가맹점',
    //   route: '/franchise/list',
    //   roles: ['FRANCHISE_MANAGER'],
    //   group: 'franchise'
    // },
    {
        label: '거래처',
        route: '/vendor/list',
        roles: ['VENDOR_MANAGER'],
        group: 'vendor'
    },
    {
        label: '거래처/창고',
        route: '/warehouse/inventory/list',
        roles: ['WAREHOUSE_MANAGER'],
        group: 'warehouse'
    },

    {
        label: '주문/반품',
        route: '/order/list',
        roles: ['SUPER_ADMIN', 'GENERAL_MANAGER', 'SENIOR_MANAGER', 'FRANCHISE_MANAGER'],
    },
    // {
    //    label: '배송',
    //    route: '/delivery/list',
    //    roles: ['WAREHOUSE_MANAGER'],
    //  },

    {
        label: '품의/발주',
        route: '/requisitions/list',
        roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'SUPER_ADMIN'],
        group: 'procurement'
    },
    {
        label: '발주',
        route: '/purchases/list',
        roles: ['VENDOR_MANAGER', "WAREHOUSE_MANAGER",],
        group: 'purchase'
    },
    {
        label: '폐기',
        route: '/disposal/list',
        roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'SUPER_ADMIN']
    },
    {
        label: '폐기',
        route: '/disposal/register',
        roles: ['WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER']
    }
]

// 권한에 따라 필터링된 메뉴
const accessibleMenus = computed(() =>
        allMenus.filter(menu => menu.roles.includes(userRole.value))
)

const isMypageRoute = computed(() => route.path.startsWith('/mypage'))

const handleClick = (menuLabel) => {
    emits('selectMenu', menuLabel)
    showMypageDropdown.value = false
    const selectedMenu = accessibleMenus.value.find(menu => menu.label === menuLabel)
    if (selectedMenu?.route) {
        router.push(selectedMenu.route)
    }
}

const toggleMypageDropdown = () => {
    showMypageDropdown.value = !showMypageDropdown.value
}

const goToMypage = () => {
    emits('selectMenu', '마이페이지')
    showMypageDropdown.value = false
    router.push('/mypage/profile')
}

const logout = async () => {
    showMypageDropdown.value = false
    await logoutApi()
    authStore.clearAuth()
    await router.push('/login')
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
    margin-top: 7px;
    margin-left: -32px;
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
    color: var(--color-primary);
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
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: flex;
    flex-direction: column;
}

.dropdown a {
    padding: 0.6rem 1rem;
    text-decoration: none;
    color: #333;
    font-size: var(--font-header-dropdown);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dropdown a:hover {
    background-color: var(--color-hover-dark);
    cursor: pointer;
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