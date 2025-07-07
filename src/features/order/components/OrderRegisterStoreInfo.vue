<!-- OrderRegisterStoreInfo.vue -->
<template>
  <div class="info-card">
    <div class="info-header">가맹점 정보</div>
    <div class="grid grid-2 gap-6">
      <ReadonlyField label="가맹점 이름" :value="store.name" />
      <ReadonlyField label="가맹점 전화번호" :value="store.phone" />
      <ReadonlyField label="점주 이름" :value="store.owner" />
      <ReadonlyField label="점주 연락처" :value="store.ownerPhone" />
    </div>
  </div>
</template>

<script setup>
import ReadonlyField from '@/components/common/fields/ReadonlyField.vue'

defineProps({
  store: Object
})
</script>
