<template>
  <RegisterInfoGroup title="결재자 정보">
    <div
        class="approver-box"
        @click="emit('searchApprover')"
    >
      <template v-if="approver?.memberId">
        <div class="name">{{ approver.name }}</div>
        <div class="info">
          <span>{{ approver.position }}</span> |
          <span>{{ approver.email }}</span>
        </div>
      </template>
      <template v-else>
        <div class="placeholder">결재자를 선택하세요</div>
      </template>
    </div>
  </RegisterInfoGroup>
</template>

<script setup>
import RegisterInfoGroup from "@/components/layout/registerview/RegisterInfoGroup.vue";

defineProps({ approver: Object })
const emit = defineEmits(['searchApprover'])
</script>

<style scoped>
.approver-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.approver-box:hover {
  background-color: #f9f9f9;
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
.placeholder {
  font-size: 0.95rem;
  color: #888;
}
</style>
