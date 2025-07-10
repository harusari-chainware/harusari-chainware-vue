<!-- components/requisition/register/RequisitionRegisterLeft.vue -->
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getMembers } from '@/features/member/api.js'
import MemberSearchModal from '@/components/common/fields/MemberSearchModal.vue'
import {useAuthStore} from "@/features/auth/useAuthStore.js";

const props = defineProps({
  approver: Object
})
const emit = defineEmits(['update:approver'])

const authStore = useAuthStore()
const authority = authStore.authority
const email = authStore.email

const drafterInfo = ref({
  name: '',
  position: '',
  phone: '',
  email: ''
})

// 요청자 정보 불러오기
onMounted(async () => {
  try {
    const res = await getMembers(email)
    drafterInfo.value = res.data
  } catch (e) {
    console.error('요청자 정보 조회 실패', e)
  }
})

// 결재자 선택 모달
const showApproverModal = ref(false)

</script>

<template>
  <div class="register-left">
    <section class="box">
      <h3>요청자 정보</h3>
      <p><strong>이름:</strong> {{ drafterInfo.name }}</p>
      <p><strong>직책:</strong> {{ drafterInfo.position }}</p>
      <p><strong>전화번호:</strong> {{ drafterInfo.phone }}</p>
      <p><strong>이메일:</strong> {{ drafterInfo.email }}</p>
    </section>

    <section class="box">
      <h3>결재자 정보</h3>
      <p><strong>이름:</strong> {{ props.approver?.name || '-' }}</p>
      <p><strong>직책:</strong> {{ props.approver?.position || '-' }}</p>
      <p><strong>전화번호:</strong> {{ props.approver?.phone || '-' }}</p>
      <button class="btn" @click="showApproverModal = true">결재자 선택</button>
    </section>

    <MemberSearchModal
        v-if="showApproverModal"
        authority="SENIOR_MANAGER"
        @select="getMembers"
        @close="showApproverModal = false"
    />
  </div>
</template>
