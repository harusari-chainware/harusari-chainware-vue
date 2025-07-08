<template>
  <RegisterInfoGroup title="결재자 정보">
    <SearchReadonlyGroup
        :model-value="approver"
        :fields="[
        { key: 'name', label: '성명' },
        { key: 'role', label: '직책' },
        { key: 'email', label: '이메일' }
      ]"
        @search="emit('searchApprover')"
    />
  </RegisterInfoGroup>
</template>

<script setup>
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import SearchReadonlyGroup from '@/components/common/fields/SearchReadonlyGroup.vue'

defineProps({ approver: Object })
const emit = defineEmits(['searchApprover'])
</script>
