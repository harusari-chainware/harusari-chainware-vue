<template>
  <button
      class="status-button"
      :class="buttonClass"
      :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default' // 'primary', 'danger', 'outline', 'approve', 'reject', etc.
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const typeClassMap = {
  primary: 'btn-primary',
  danger: 'btn-danger',
  outline: 'btn-outline',
  approve: 'btn-approve',
  reject: 'btn-reject',
  return: 'btn-return',
  reset: 'btn-reset',
  default: 'btn-default'
}

const buttonClass = computed(() => typeClassMap[props.type] || 'btn-default')
</script>

<style scoped>
.status-button {
  padding: 6px 16px;
  font-size: var(--font-button);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
}

/* 기본 */
.btn-default {
  background-color: var(--color-gray-200);
  color: var(--color-gray-900);
}

/* 주요 액션 */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background-color: #2c91bc;
}

/* 위험 */
.btn-danger {
  background-color: #ef4444;
  color: white;
}
.btn-danger:hover {
  background-color: #dc2626;
}

/* 외곽선 */
.btn-outline {
  background-color: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}
.btn-outline:hover {
  background-color: #f3f4f6;
}

/* 상태 기반 */
.btn-approve {
  background-color: #d1fae5;
  color: #065f46;
}
.btn-approve:hover {
  background-color: #a7f3d0;
}

.btn-reject {
  background-color: #fee2e2;
  color: #b91c1c;
}
.btn-reject:hover {
  background-color: #fecaca;
}

.btn-return {
  background-color: #fef3c7;
  color: #92400e;
}
.btn-return:hover {
  background-color: #fde68a;
}

.btn-reset {
  background-color: var(--color-gray-200);
  color: var(--color-gray-900);
}

.btn-reset:hover {
  background-color: var(--color-gray-400);
}

</style>
