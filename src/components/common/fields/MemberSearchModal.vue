<!-- components/common/MemberSearchModal.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close', 'select'])

const keyword = ref('')
const members = ref([])
const isLoading = ref(false)

const fetchMembers = async () => {
  isLoading.value = true
  try {
    // 예시 API (실제 구현에 따라 axios 호출)
    const response = await fetch(`/members?role=SENIOR_MANAGER&keyword=${keyword.value}`)
    const data = await response.json()
    members.value = data
  } catch (e) {
    console.error('❌ 멤버 검색 실패', e)
    members.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSelect = (member) => {
  emit('select', member)
  emit('close')
}

watch(() => props.show, (val) => {
  if (val) {
    keyword.value = ''
    members.value = []
  }
})
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-header">
      <h3>결재자 검색</h3>
      <button class="close-btn" @click="$emit('close')">닫기</button>
    </div>
    <div class="modal-body">
      <input
          v-model="keyword"
          placeholder="이름 또는 이메일 검색"
          @keyup.enter="fetchMembers"
      />
      <button class="btn search" @click="fetchMembers">검색</button>

      <div v-if="isLoading">로딩 중...</div>
      <ul>
        <li v-for="member in members" :key="member.memberId" @click="handleSelect(member)">
          <div class="name">{{ member.name }}</div>
          <div class="info">{{ member.position }} / {{ member.phone }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
