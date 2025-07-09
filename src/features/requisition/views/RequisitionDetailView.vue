
<template>
  <DetailLayout
      title="품의서 상세"
      description="품의 요청에 대한 기본 정보와 품목 내역을 확인할 수 있습니다."
  >
    <!-- 상단 버튼 -->
    <template #actions>
      <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
      <StatusButton type="approve" @click="handleApprove">승인</StatusButton>
      <StatusButton type="reject" @click="openRejectDialog">반려</StatusButton>
    </template>

    <!-- 기본 정보 -->
    <template #basic>
      <RequisitionDetailBasic :requisition="requisition" />
    </template>

    <!-- 품목 리스트 -->
    <template #detail>
      <RequisitionDetailDetail :items="requisition.products" />
    </template>

    <!-- 반려 사유 입력 -->
    <RejectReasonDialog v-model="showRejectDialog" @confirm="handleReject" />
  </DetailLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRequisitionById } from '@/features/requisition/RequisitionApi.js'
import DetailLayout from "@/components/layout/DetailLayout.vue";

const props = defineProps({
  requisitionId: {
    type: [Number, String],
    required: true
  }
})

const requisitionDetail = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  const id = Number(props.requisitionId)
  if (!id) {
    console.error('❌ 유효하지 않은 ID')
    return
  }

  try {
    const res = await getRequisitionById(id)
    const { requisitionInfo, createdMember, approvedMember, vendor, warehouse, items } = res.data.data

    requisitionDetail.value = {
      requisitionId: requisitionInfo.requisitionId,
      requisitionCode: requisitionInfo.requisitionCode,
      status: requisitionInfo.requisitionStatus,
      dueDate: requisitionInfo.dueDate,
      createdAt: requisitionInfo.createdAt,
      submittedAt: requisitionInfo.submittedAt,
      approvedAt: requisitionInfo.approvedAt,
      rejectReason: requisitionInfo.rejectReason,

      writer: {
        name: createdMember.name,
        position: createdMember.position,
        email: createdMember.email,
        contact: createdMember.contact
      },
      approver: {
        name: approvedMember.name,
        position: approvedMember.position,
        email: approvedMember.email,
        contact: approvedMember.contact
      },
      vendor: {
        name: vendor.name,
        type: vendor.type,
        manager: vendor.managerName,
        contact: vendor.vendorContact
      },
      warehouse: {
        name: warehouse.name,
        manager: warehouse.managerName,
        contact: warehouse.warehouseContact
      },
      products: items.map((item, idx) => ({
        no: idx + 1,
        name: item.productName,
        code: item.productCode,
        quantity: item.quantity,
        price: item.unitPrice,
        moq: item.moq,
        totalPrice: item.totalPrice
      }))
    }
  } catch (e) {
    console.error('❌ 조회 실패:', e)
  } finally {
    isLoading.value = false
  }
})
</script>
