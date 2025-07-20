<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/useAuthStore'
import NormalDisposalForm from '@/features/disposal/components/NormalDisposalForm.vue'
import TakebackDisposalForm from '@/features/disposal/components/TakebackDisposalForm.vue'
import RecentDisposalTable from '@/features/disposal/components/RecentDisposalTable.vue'
import { fetchRecentDisposalsAPI } from '@/features/disposal/api.js'

const authStore = useAuthStore()
const activeTab = ref('normal')
const recentDisposals = ref([])

//  권한을 ref로 가져와서 watch로 반응
const authorityType = ref('')
const showTakebackTab = computed(() => authorityType.value !== 'FRANCHISE_MANAGER')

//  권한 초기화
watch(
    () => authStore.authority,
    (value) => {
      authorityType.value = value
    },
    { immediate: true }
)

const fetchRecentDisposals = async () => {
  try {
    const res = await fetchRecentDisposalsAPI()
    recentDisposals.value = res.data?.data?.items || []
  } catch (e) {
    console.error('최근 폐기 내역 조회 실패', e)
  }
}

onMounted(() => {
  fetchRecentDisposals()
})
</script>

<template>
  <div class="main-content">
    <div class="content-wrapper">
      <!-- 안내 -->
      <div class="alert alert-info">
        <div class="alert-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </div>
        <div class="alert-content">
          <div class="alert-title">폐기 등록 안내</div>
          <div class="alert-message">
            폐기할 상품 정보와 수량, 사유를 입력하여 폐기를 등록할 수 있습니다. 반품된 상품의 경우 반품 ID를 함께 입력해주세요.
          </div>
        </div>
      </div>

      <!-- 탭: 일반 관리자/창고 관리자만 보임 -->
      <div class="tabs" v-if="showTakebackTab">
        <div :class="['tab', activeTab === 'normal' ? 'active' : '']" @click="activeTab = 'normal'">일반 폐기</div>
        <div :class="['tab', activeTab === 'takeback' ? 'active' : '']" @click="activeTab = 'takeback'">반품 폐기</div>
      </div>

      <!-- 폼 -->
      <NormalDisposalForm
          v-if="!showTakebackTab || activeTab === 'normal'"
          @submitted="fetchRecentDisposals"
      />
      <TakebackDisposalForm
          v-if="showTakebackTab && activeTab === 'takeback'"
          @submitted="fetchRecentDisposals"
      />

      <!-- 최근 폐기 내역 -->
      <RecentDisposalTable :items="recentDisposals" />
    </div>
  </div>
</template>

<style scoped>
.main-content {
  padding: 24px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

.alert {
  display: flex;
  align-items: start;
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.alert-icon {
  margin-right: 12px;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: #4f46e5;
}

.tab.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}
</style>
