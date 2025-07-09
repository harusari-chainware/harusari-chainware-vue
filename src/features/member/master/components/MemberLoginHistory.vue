<template>
    <div class="card">
        <div class="section-header">
            <div class="title-wrapper">
                <div class="indicator"></div>
                <h2 class="title">로그인 내역</h2>
            </div>
            <p class="description">최근 로그인 활동을 확인할 수 있습니다.</p>
        </div>

        <SkeletonList v-if="isLoading" :rows="8" :columns="3" />
        <div v-else>
            <table class="login-table">
                <thead>
                <tr>
                    <th>로그인 일시</th>
                    <th>IP 주소</th>
                    <th>브라우저</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in loginHistory" :key="item.loginAt + item.ipAddress">
                    <td>{{ formatDateTime(item.loginAt) }}</td>
                    <td>{{ item.ipAddress }}</td>
                    <td>{{ item.browser }}</td>
                </tr>
                <tr v-if="loginHistory.length === 0">
                    <td colspan="3" class="empty-row">로그인 내역이 없습니다.</td>
                </tr>
                </tbody>
            </table>

            <Pagination
                    v-model="currentPage"
                    :total-items="totalElements"
                    :items-per-page="pageable.size"
            />
        </div>
    </div>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue'
import Pagination from '@/components/common/Pagination.vue'
import {getMemberLoginHistory} from '@/features/member/api.js'
import SkeletonList from "@/components/common/SkeletonList.vue";

const props = defineProps({
    memberId: {
        type: [String, Number],
        required: true,
    },
})

const loginHistory = ref([])
const pageable = ref({page: 0, size: 10})
const totalElements = ref(0)
const isLoading = ref(true)
const currentPage = ref(1)

function formatDateTime(dateTime) {
    if (!dateTime) return '-'
    const date = new Date(dateTime)
    return date.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})
}

async function fetchLoginHistory(delayMs = 0) {
    isLoading.value = true
    try {
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        const response = await getMemberLoginHistory(props.memberId, {
            page: currentPage.value - 1,
            size: pageable.value.size,
        })
        const pageData = response.data.data
        loginHistory.value = pageData.contents
        totalElements.value = pageData.totalElements
    } catch (error) {
        console.error('로그인 내역 조회 실패:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => fetchLoginHistory(1000))
watch(currentPage, () => fetchLoginHistory(250))
</script>

<style scoped>
.card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    max-width: 1500px;
    margin: 0 auto;
    width: 100%;
}

.section-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.title-wrapper {
    display: flex;
    align-items: center;
}

.title {
    font-size: var(--font-page-title-large);
    font-weight: bold;
    color: var(--color-gray-900);
    margin-bottom: 4px;
    border-left: 4px solid var(--color-primary);
    padding-left: 10px;
}

.description {
    font-size: 1rem;
    color: #6c757d;
}

.login-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    margin-top: 12px;
}

.login-table th,
.login-table td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
}

.login-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
}

.login-table tr:hover {
    background: #f1f3f5;
}

.empty-row {
    text-align: center;
    padding: 16px 0;
    color: #868e96;
}
</style>
