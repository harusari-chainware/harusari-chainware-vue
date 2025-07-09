<template>
    <ListLayout
            title="회원 목록"
            description="모든 회원 목록을 조회하고 관리할 수 있습니다."
    >
        <!-- filters -->
        <template #filters>
            <form class="search-bar" @submit.prevent="handleSearch">
                <!-- 이메일 필드에서 엔터를 누르면 handleSearch 실행 -->
                <FilterText v-model="filters.email" label="이메일" placeholder="이메일 입력" @keydown.enter.prevent="handleSearch"/>
                <!-- 직책 필드에서 엔터를 누르면 handleSearch 실행 -->
                <FilterText v-model="filters.position" label="직책" placeholder="직책 입력" @keydown.enter.prevent="handleSearch"/>
                <FilterSelect v-model="filters.authorityName" label="권한" :options="authorityOptions"/>
                <FilterSelect v-model="filters.isDeleted" label="탈퇴 여부" :options="withdrawalOptions"/>
                <FilterDateRange v-model="filters.joinDateRange" label="가입일 범위"/>
                <FilterButtons @reset="resetFilters" @apply="handleSearch"/>
            </form>
        </template>

        <!-- table -->
        <template #table>
            <SkeletonList v-if="isLoading" :rows="8" :columns="columns.length" />
            <EmptyResult v-else-if="members.length === 0" message="등록된 회원이 없습니다." />
            <template v-else>
                <GenericTable
                        :columns="columns"
                        :items="formattedMembers"
                        @edit="handleEdit"
                >
                    <template #isDeleted="{ item }">
                        <span>{{ item.isDeleted ? '탈퇴' : '정상' }}</span>
                    </template>
                </GenericTable>
                <Pagination
                        v-model="currentPage"
                        :total-items="totalItems"
                        :items-per-page="itemsPerPage"
                        :pages-per-group="5"
                />
            </template>
        </template>
    </ListLayout>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {getMembers} from '@/features/member/api.js'

import ListLayout from '@/components/layout/ListLayout.vue'
import EmptyResult from "@/components/common/EmptyResult.vue"
import Pagination from '@/components/common/Pagination.vue'
import SkeletonList from "@/components/common/SkeletonList.vue"
import GenericTable from '@/components/common/GenericTable.vue'
import FilterText from '@/components/common/filters/FilterText.vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import FilterButtons from '@/components/common/filters/FilterButtons.vue'
import FilterDateRange from "@/components/common/filters/FilterDateRange.vue";

const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)
const members = ref([])

const filters = ref({
    email: '',
    position: '',
    authorityName: '',
    isDeleted: 'false',
    joinDateRange: { start: '', end: '' }
})

const authorityOptions = [
    { label: '전체', value: '' },
    { label: '마스터', value: 'MASTER' },
    { label: '일반 관리자', value: 'GENERAL_MANAGER' },
    { label: '책임 관리자', value: 'SENIOR_MANAGER' },
    { label: '창고 관리자', value: 'WAREHOUSE_MANAGER' },
    { label: '가맹점 담당자', value: 'FRANCHISE_MANAGER' },
    { label: '거래처 담당자', value: 'VENDOR_MANAGER' },
    { label: '시스템', value: 'SYSTEM' }
]

const withdrawalOptions = [
    { label: '전체', value: '' },
    { label: '정상', value: 'false' },
    { label: '탈퇴', value: 'true' }
]

const columns = [
    { key: 'memberId', label: '아이디' },
    { key: 'email', label: '이메일' },
    { key: 'name', label: '이름' },
    { key: 'authorityLabelKr', label: '권한' },
    { key: 'phoneNumber', label: '전화번호' },
    { key: 'birthDate', label: '생년월일' },
    { key: 'position', label: '직책' },
    { key: 'joinAt', label: '가입일' },
    { key: 'isDeleted', label: '탈퇴 여부' }
]

// 필터 적용을 위한 파라미터 빌드 함수
const buildParams = () => {
    const f = filters.value;
    const params = {
        page: currentPage.value - 1,
        size: itemsPerPage,
        isDeleted: f.isDeleted === "" ? "false" : f.isDeleted,
    };

    // 이메일, 직책, 권한, 탈퇴 여부 필터 추가
    if (f.email) params.email = f.email;
    if (f.position) params.position = f.position;
    if (f.authorityName) params.authorityName = f.authorityName;
    if (f.isDeleted !== "") params.isDeleted = f.isDeleted;

    // 날짜 범위 필터 추가
    if (f.joinDateRange.start) params.joinDateFrom = f.joinDateRange.start;
    if (f.joinDateRange.end) params.joinDateTo = f.joinDateRange.end;

    console.log("params", params);
    return params;
};

// 회원 목록 조회
const fetchMembers = async () => {
    isLoading.value = true;
    try {
        const response = await getMembers(buildParams());
        const data = response.data.data;
        members.value = data.contents ?? [];
        totalItems.value = data.totalElements ?? 0;
    } catch (error) {
        console.error("회원 목록 조회 실패:", error);
    } finally {
        isLoading.value = false;
    }
};

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
        isDeleted: '',
        joinDateRange: { start: '', end: '' }  // 날짜 범위 초기화
    }
    handleSearch();
}

// 수정 처리 (모달 또는 라우팅 처리)
const handleEdit = (member) => {
    console.log('Edit member:', member)
    // 모달 오픈 또는 라우팅 처리
}

// 페이지 변경 시 회원 목록 재조회
watch(currentPage, fetchMembers)

// 컴포넌트 마운트 시 회원 목록 조회
onMounted(() => {
    fetchMembers()
})

// 전화번호 포맷
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return ''
    return phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
}

// 가입일 포맷
const formatJoinDate = (joinDate) => {
    if (!joinDate) return '';
    const date = new Date(joinDate); // 서버에서 받은 날짜를 Date 객체로 변환
    // 한국 시간대(KST)로 변환
    const localDate = date.toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    // 날짜 형식을 'YYYY-MM-DD'로 수정하고, 마침표 제거
    return localDate.replace(/\./g, '').replace(/\s/g, '-'); // '.'을 제거하고, 공백을 '-'로 변환
}

// 데이터 포맷 적용
const formattedMembers = computed(() => {
    return members.value.map(member => ({
        ...member,
        phoneNumber: formatPhoneNumber(member.phoneNumber),
        joinAt: formatJoinDate(member.joinAt),
        isDeleted: member.isDeleted ? '탈퇴' : '정상' // isDeleted 값 변환
    }))
})
</script>

<style scoped>
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
</style>
