<template>
  <DetailLayout
      v-if="requisitionDetail"
      title="품의서 상세"
      description="품의 요청에 대한 기본 정보와 품목 내역을 확인할 수 있습니다."
  >
    <!-- actions -->
    <template #actions>
      <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
      <StatusButton type="approve" @click="handleApprove">승인</StatusButton>
      <StatusButton type="reject" @click="openRejectDialog">반려</StatusButton>
    </template>

    <!-- 기본 정보 -->
    <template #basic>
      <RequisitionDetailBasic :requisitionDetail="requisitionDetail" />
    </template>

    <!-- 품목 리스트 -->
    <template #detail>
      <RequisitionDetailDetail :items="requisitionDetail.products" />
    </template>

    <!-- 반려 사유 입력 -->
    <RejectReasonDialog v-model="showRejectDialog" @confirm="handleReject" />
  </DetailLayout>

  <SkeletonDetail v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRequisitionById } from '@/features/requisition/RequisitionApi.js'
import DetailLayout from "@/components/layout/DetailLayout.vue";
import RequisitionDetailBasic from "@/features/requisition/components/RequisitionDetailBasic.vue";
import RequisitionDetailDetail from "@/features/requisition/components/RequisitionDetailDetail.vue";
import RejectReasonDialog from "@/components/common/RejectReasonDialog.vue";
import SkeletonDetail from "@/components/common/SkeletonDetail.vue";
import StatusButton from "@/components/common/StatusButton.vue";

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
      approvedAt: requisitionInfo.modifiedAt, // 기존 approvedAt이 없음 → modifiedAt으로 대체
      rejectReason: requisitionInfo.rejectReason,

      drafter: {
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
        index: idx,
        productCode: item.productCode,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
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
