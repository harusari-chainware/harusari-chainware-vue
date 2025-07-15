<template>
  <RegisterInfoGroup title="결재자 정보">
    <ul class="approver-list">
      <li
          v-for="member in approvers"
          :key="member.memberId"
          :class="{ selected: member.memberId === approver?.memberId }"
          @click="selectApprover(member)"
      >
        <div class="name">{{ member.name }}</div>
        <div class="info">
          <span>{{ member.position }}</span> |
          <span>{{ member.email }}</span>
        </div>
      </li>
    </ul>
  </RegisterInfoGroup>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import { getMembers } from "@/features/member/api.js";

const props = defineProps({
  approver: Object
})
const emit = defineEmits(['update:approver'])

const approvers = ref([])

onMounted(async () => {
  try {
    const { data } = await getMembers({ authorityName: 'SENIOR_MANAGER' })
    approvers.value = data.data.contents || []
  } catch (error) {
    console.error('[결재자 목록 조회 실패]', error)
  }
})

function selectApprover(member) {
  emit('update:approver', {
    memberId: member.memberId,
    name: member.name,
    email: member.email,
    phoneNumber: member.phoneNumber,
    position: member.position
  })
}
</script>

<style scoped>
.approver-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.approver-list li {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.approver-list li:hover {
  background-color: #f9f9f9;
}

.approver-list li.selected {
  border-color: var(--color-primary);
  background-color: #eef8ff;
}

.name {
  font-weight: bold;
  font-size: 1rem;
}

.info {
  font-size: 0.875rem;
  color: #555;
  margin-top: 0.25rem;
}
</style>
