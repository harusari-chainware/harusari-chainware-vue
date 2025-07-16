<script setup>
import { ref, watch } from 'vue'
import { getMembers } from '@/features/member/api.js'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible', 'select'])

const keyword = ref('')
const members = ref([])
const isLoading = ref(false)

watch(() => props.visible, async (val) => {
  if (val) {
    keyword.value = ''
    members.value = []
    await searchMembers()
  }
})

const close = () => emit('update:visible', false)

const searchMembers = async () => {
  isLoading.value = true
  try {
    const response = await getMembers({ authorityName: 'SENIOR_MANAGER' })
    const contents = response?.data?.data?.contents
    members.value = Array.isArray(contents) ? contents : []
  } catch (e) {
    console.error(' 멤버 검색 실패', e)
    members.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSelect = (member) => {
  emit('select', member)
  close()
}
</script>

<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <h2>결재자 검색</h2>
        <button class="close-button" @click="close">×</button>
      </div>

      <div class="modal-body">
        <input
            v-model="keyword"
            @input="searchMembers"
            placeholder="이름 또는 이메일로 검색"
            class="search-input"
        />

        <ul v-if="members.length > 0" class="item-list">
          <li
              v-for="member in members"
              :key="member.memberId"
              @click="handleSelect(member)"
          >
            <div class="item-main">{{ member.name }}</div>
            <div class="item-sub">
              {{ member.position }} · {{ member.phoneNumber }} · {{ member.email }}
            </div>
          </li>
        </ul>

        <div v-else class="empty-message">
          {{ isLoading ? '불러오는 중...' : '검색 결과가 없습니다.' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  width: 520px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e3e7ec;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0;
  color: #1f2d3d;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #1f2d3d;
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccd5df;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: #1f2d3d;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 260px;
  overflow-y: auto;
}

.item-list li {
  border: 1px solid #e3e7ec;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fafbfd;
}

.item-list li:hover {
  background-color: #e9f4fb;
  border-color: #3aaed8;
}

.item-main {
  font-size: 1rem;
  font-weight: 600;
  color: #3aaed8;
}

.item-sub {
  margin-top: 4px;
  font-size: 0.875rem;
  color: #6c7a89;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.95rem;
}
</style>
