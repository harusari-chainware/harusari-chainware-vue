<template>
  <RegisterFooter>
    <template #actions>
      <StatusButton type="primary" @click="submit">등록</StatusButton>
      <StatusButton type="reset" @click="cancel">취소</StatusButton>
    </template>
  </RegisterFooter>
</template>

<script setup>
import RegisterFooter from '@/components/layout/registerview/RegisterFooter.vue'
import StatusButton from "@/components/common/StatusButton.vue"
import { createRequisition } from '../../RequisitionApi.js'
import {ref} from "vue";

// 임시: 폼 데이터 예시

const drafter = ref(null)           // RequisitionRegisterDrafterInfo에서 전달
const approver = ref(null)          // RequisitionRegisterApproverInfo에서 전달
const vendor = ref(null)            // 거래처
const warehouse = ref(null)         // 창고
const dueDate = ref('')             // 납기일 (yyyy-MM-dd)
const selectedProducts = ref([])    // 선택된 품목 리스트

const submit = async () => {
  try {
    console.log('🚨 drafter:', drafter.value)
    console.log('🚨 approver:', approver.value)
    console.log('🚨 vendor:', vendor.value)
    console.log('🚨 warehouse:', warehouse.value)
    console.log('🚨 dueDate:', dueDate.value)
    console.log('🚨 selectedProducts:', selectedProducts.value)
    // 필수 데이터 유효성 검사 (예시)
    if (!drafter.value || !approver.value || !vendor.value || !warehouse.value) {
      alert('기안자, 승인자, 거래처, 창고 정보를 모두 입력해 주세요.')
      return
    }

    if (!dueDate.value) {
      alert('납기일을 입력해 주세요.')
      return
    }

    if (!selectedProducts.value.length) {
      alert('등록할 품목을 선택해 주세요.')
      return
    }

    // 등록 요청 데이터 조립
    const requisitionRequest = {
      drafterId: drafter.value.memberId,
      approverId: approver.value.memberId,
      vendorId: vendor.value.vendorId,
      warehouseId: warehouse.value.warehouseId,
      dueDate: dueDate.value,
      items: selectedProducts.value.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.unitPrice
      }))
    }

    console.log('🚀 등록 요청:', requisitionRequest)

    // API 호출
    const res = await createRequisition(requisitionRequest)

    console.log('✅ 등록 성공:', res.data)
    alert('품의서가 성공적으로 등록되었습니다.')

    // 성공 후 리다이렉트 or 초기화 로직 추가 가능
    // router.push('/requisitions') 등
  } catch (error) {
    console.error('❌ 등록 실패:', error)
    alert('등록에 실패했습니다. 다시 시도해 주세요.')
  }
}
</script>