<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-card">
        <h2 class="modal-title">결재자 선택</h2>

        <!-- 검색 입력 -->
        <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="이름, 직책, 이메일로 검색"
        />

        <!-- 필터링된 리스트 -->
        <ul class="approver-grid">
          <li
              v-for="member in filteredApprovers"
              :key="member.memberId"
              class="approver-card"
              @click="select(member)"
          >
            <div class="approver-name">{{ member.name }}</div>
            <div class="approver-detail">
              <span>{{ member.position }}</span> | <span>{{ member.email }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMembers } from '@/features/member/api.js'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible', 'select'])

const approvers = ref([])
const search = ref('')

onMounted(async () => {
  try {
    const { data } = await getMembers({ authorityName: 'SENIOR_MANAGER' })
    approvers.value = data.data.contents || []
  } catch (err) {
    console.error('결재자 목록 조회 실패:', err)
  }
})

const close = () => emit('update:visible', false)
const select = (member) => emit('select', member)

// 검색 필터링
const filteredApprovers = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return approvers.value

  return approvers.value.filter((member) =>
      [member.name, member.position, member.email].some(field =>
          field?.toLowerCase().includes(keyword)
      )
  )
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  width: 640px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 1.25rem;
  font-family: 'SUIT', 'Pretendard', sans-serif;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.approver-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.approver-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.approver-card:hover {
  background-color: #f0fbff;
  border-color: #3aaed8;
}

.approver-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2d3d;
}

.approver-detail {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #555;
}
</style>
