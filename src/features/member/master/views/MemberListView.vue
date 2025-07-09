<template>
    <ListLayout
            title="회원 목록"
            description="모든 회원 목록을 조회하고 관리할 수 있습니다."
    >
        <!-- filters -->
        <template #filters>
            <form class="search-bar" @submit.prevent="handleSearch">
                <FilterText v-model="filters.email" label="이메일" placeholder="이메일 입력"
                            @keydown.enter.prevent="handleSearch"/>
                <FilterText v-model="filters.position" label="직책" placeholder="직책 입력"
                            @keydown.enter.prevent="handleSearch"/>
                <FilterSelect v-model="filters.authorityName" label="권한" :options="authorityOptions"/>
                <FilterSelect v-model="filters.isDeleted" label="탈퇴 여부" :options="withdrawalOptions"/>
                <FilterDateRange v-model="filters.joinDateRange" label="가입일 범위"/>
                <FilterButtons @reset="resetFilters" @apply="handleSearch"/>
            </form>
        </template>

        <!-- table -->
        <template #table>
            <SkeletonList v-if="isLoading" :rows="8" :columns="columns.length"/>
            <EmptyResult v-else-if="members.length === 0" message="등록된 회원이 없습니다."/>
            <template v-else>
                <GenericTable :columns="columns" :items="formattedMembers">
                    <!-- 탈퇴 여부 컬럼 배지 -->
                    <template #cell-isDeleted="{ value }">
                        <span :class="['badge', value === '활동 중' ? 'badge-active' : 'badge-inactive']">
                            {{ value }}
                        </span>
                    </template>

                    <!-- 권한 컬럼 배지 -->
                    <template #cell-authorityLabelKr="{ value }">
                        <span :class="['badge', authorityBadgeClass(value)]">
                            {{ value }}
                        </span>
                    </template>

                    <!-- 상세 보기 버튼 -->
                    <template #cell-detail="{ item }">
                        <RouterLink
                                :to="`/member/${item.memberId}`"
                                class="detail-link"
                        >
                            상세 보기
                        </RouterLink>
                    </template>
                </GenericTable>

                <Pagination
                        v-model="currentPage"
                        :total-items="totalItems"
                        :items-per-page="itemsPerPage"
                />
            </template>
        </template>
    </ListLayout>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {getMembers} from '@/features/member/api.js'

import ListLayout from '@/components/layout/ListLayout.vue'
import EmptyResult from "@/components/common/EmptyResult.vue"
import Pagination from '@/components/common/Pagination.vue'
import GenericTable from '@/components/common/GenericTable.vue'
import FilterText from '@/components/common/filters/FilterText.vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'
import FilterDateRange from "@/components/common/filters/FilterDateRange.vue";
import SkeletonList from "@/components/common/SkeletonList.vue";
import {useAuthStore} from "@/features/auth/useAuthStore.js";

// 상태
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)
const members = ref([])

// 필터 상태
const filters = ref({
    email: '',
    position: '',
    authorityName: '',
    isDeleted: null,
    joinDateRange: {start: '', end: ''}
})

// 권한, 탈퇴 여부 옵션
const authorityOptions = [
    {label: '마스터', value: 'MASTER'},
    {label: '일반 관리자', value: 'GENERAL_MANAGER'},
    {label: '책임 관리자', value: 'SENIOR_MANAGER'},
    {label: '창고 관리자', value: 'WAREHOUSE_MANAGER'},
    {label: '가맹점 담당자', value: 'FRANCHISE_MANAGER'},
    {label: '거래처 담당자', value: 'VENDOR_MANAGER'},
    {label: '시스템', value: 'SYSTEM'}
]

const withdrawalOptions = [
    {label: '전체', value: null},
    {label: '정상', value: 'false'},
    {label: '탈퇴', value: 'true'}
]

// 컬럼 정의
const columns = [
    {key: 'memberId', label: '회원 ID'},
    {key: 'email', label: '이메일'},
    {key: 'name', label: '이름'},
    {key: 'authorityLabelKr', label: '권한'},
    {key: 'position', label: '직책'},
    {key: 'joinAt', label: '가입일'},
    {key: 'isDeleted', label: '탈퇴 여부'},
    {key: 'detail', label: '상세'}
]

// 파라미터 빌드
const buildParams = () => {
    const f = filters.value
    const params = {
        page: currentPage.value - 1,
        size: itemsPerPage,
        isDeleted: f.isDeleted === '' ? null : f.isDeleted
    }
    if (f.email) params.email = f.email
    if (f.position) params.position = f.position
    if (f.authorityName) params.authorityName = f.authorityName
    if (f.joinDateRange.start) params.joinDateFrom = f.joinDateRange.start
    if (f.joinDateRange.end) params.joinDateTo = f.joinDateRange.end

    console.log('params', params)
    return params
}

// 회원 목록 조회
const fetchMembers = async () => {
    isLoading.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 500)) // UX 지연
        const response = await getMembers(buildParams())
        const data = response.data.data
        members.value = data.contents ?? []
        totalItems.value = data.totalElements ?? 0
    } catch (error) {
        console.error('회원 목록 조회 실패:', error)
    } finally {
        isLoading.value = false
    }
}

// 검색 처리
const handleSearch = () => {
    currentPage.value = 1
    fetchMembers()
}

// 필터 초기화
const resetFilters = () => {
    filters.value = {
        email: '',
        position: '',
        authorityName: '',
        isDeleted: null,
        joinDateRange: {start: '', end: ''}
    }
    handleSearch()
}

// 페이지 변경 시 조회
watch(currentPage, fetchMembers)

// 마운트 시 조회
onMounted(fetchMembers)

// 권한 배지 클래스 매핑
const authorityBadgeClass = (label) => {
    switch (label) {
        case '마스터':
            return 'badge-master'
        case '일반 관리자':
            return 'badge-general'
        case '책임 관리자':
            return 'badge-senior'
        case '창고 관리자':
            return 'badge-warehouse'
        case '가맹점 담당자':
            return 'badge-franchise'
        case '거래처 담당자':
            return 'badge-vendor'
        case '시스템':
            return 'badge-system'
        default:
            return 'badge-default'
    }
}

// 포맷터
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return ''
    return phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
}

const formatJoinDate = (joinDate) => {
    if (!joinDate) return ''
    const date = new Date(joinDate)
    const localDate = date.toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
    return localDate.replace(/\./g, '').replace(/\s/g, '-')
}

// 포맷된 members
const formattedMembers = computed(() =>
        members.value.map(member => ({
            ...member,
            phoneNumber: formatPhoneNumber(member.phoneNumber),
            joinAt: formatJoinDate(member.joinAt),
            isDeleted: member.isDeleted ? '탈퇴' : '활동 중'
        }))
)

const router = useRouter()
const goToMemberDetail = (memberId) => {
    router.push(`/members/${memberId}`)
}

const authStore = useAuthStore()

onMounted(() => {
    if (authStore.authority !== 'MASTER') {
        alert('접근 권한이 없습니다.');
        router.replace('/'); // 혹은 원하는 다른 페이지
    }
});
</script>

<style scoped>
/* 기존 스타일 유지 */
h2 {
    text-align: center;
    font-weight: 700;
    color: #2e384d;
    margin-bottom: 20px;
}

.search-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.detail-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
}

.detail-link:hover {
    text-decoration: underline;
}

.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #fff;
    display: inline-block;
    text-align: center;
}

.badge-active {
    background-color: #17c3b2;
}

.badge-inactive {
    background-color: #fe6d73;
}

/* 권한 배지 색상 */
.badge-master {
    background-color: #ef476f;
}

.badge-general {
    background-color: #ffd166;
}

.badge-senior {
    background-color: #06d6a0;
}

.badge-warehouse {
    background-color: #118ab2;
}

.badge-franchise {
    background-color: #073b4c;
}

.badge-vendor {
    background-color: #7678ed;
}
</style>