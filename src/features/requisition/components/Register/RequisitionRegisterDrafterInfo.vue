<template>
  <RegisterInfoGroup title="기안자 정보">
    <div class="grid grid-2 gap-6">
      <ReadonlyField label="이름" :value="drafter.name" />
      <ReadonlyField label="전화번호" :value="drafter.phoneNumber" />
      <ReadonlyField label="직책" :value="drafter.position" />
      <ReadonlyField label="이메일" :value="drafter.email" />
    </div>
  </RegisterInfoGroup>
</template>

<script setup>
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import ReadonlyField from '@/components/common/fields/ReadonlyField.vue'

defineProps({
  drafter: Object
})
</script>
