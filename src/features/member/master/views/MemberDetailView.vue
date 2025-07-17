<template>
    <DetailLayout
            title="회원 상세 정보"
            description="회원의 상세 정보를 확인할 수 있습니다."
    >
        <template #basic>
            <div v-if="isLoading">로딩 중...</div>
            <div v-else-if="member">
                <div class="detail-stack">
                    <!-- 회원 상세 -->
                    <MemberDetailBasic :member="member" @refresh="fetchMemberDetail" />
                    <!-- 로그인 내역 -->
                    <MemberLoginHistory :member-id="memberId" />
                </div>
            </div>
            <div v-else>회원 정보를 불러올 수 없습니다.</div>
        </template>
    </DetailLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMemberDetail } from '@/features/member/api.js'

import DetailLayout from '@/components/layout/DetailLayout.vue'
import MemberDetailBasic from '@/features/member/master/components/MemberDetailBasic.vue'
import MemberLoginHistory from '@/features/member/master/components/MemberLoginHistory.vue'

const route = useRoute()
const memberId = route.params.memberId

const isLoading = ref(true)
const member = ref(null)

const fetchMemberDetail = async () => {
    isLoading.value = true
    try {
        const response = await getMemberDetail(memberId)
        // 참조를 교체하여 reactivity 강제 갱신
        member.value = { ...response.data.data }
    } catch (error) {
        console.error('회원 상세 조회 실패:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchMemberDetail)
</script>

<style scoped>
.action-button {
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: #fff;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: background-color 0.2s ease;
}

.action-button:hover {
    cursor: pointer;
}

.detail-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
</style>