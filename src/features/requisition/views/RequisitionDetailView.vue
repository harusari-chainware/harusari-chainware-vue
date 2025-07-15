<template>
  <DetailLayout
      v-if="requisitionDetail"
      title="품의서 상세"
      description="품의 요청에 대한 기본 정보와 품목 내역을 확인할 수 있습니다."
  >
    <!-- actions -->
    <template #actions>
      <template v-if="isSaved && isGeneralManager">
        <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
        <StatusButton type="approve" @click="handleSubmit">상신</StatusButton>
        <StatusButton type="reject" @click="handleDelete">삭제</StatusButton>
      </template>

      <template v-if="isSubmitted && isSeniorManager">
        <StatusButton type="approve" @click="openApproveDialog">승인</StatusButton>
        <StatusButton type="reject" @click="openRejectDialog">반려</StatusButton>
      </template>
    </template>

    <template #basic>
      <RequisitionDetailBasic :requisitionDetail="requisitionDetail" />
    </template>

    <template #detail>
      <RequisitionDetailDetail :items="requisitionDetail.products" />
    </template>

    <RejectReasonDialog
        v-model="showRejectDialog"
        @confirm="handleReject"
    />

    <ConfirmDialog
        v-model="showApproveDialog"
        title="승인하시겠습니까?"
        description="승인 후에는 품의서를 수정할 수 없습니다."
        @confirm="handleApprove"
    />
  </DetailLayout>

  <SkeletonDetail v-else />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getRequisitionById,
  submittedRequisition,
  approveRequisition,
  rejectRequisition,
  deleteRequisition
} from '@/features/requisition/RequisitionApi.js'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import RequisitionDetailBasic from '@/features/requisition/components/RequisitionDetailBasic.vue'
import RequisitionDetailDetail from '@/features/requisition/components/RequisitionDetailDetail.vue'
import RejectReasonDialog from '@/components/common/RejectReasonDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import SkeletonDetail from '@/components/common/SkeletonDetail.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import { useAuthStore } from '@/features/auth/useAuthStore.js'

const props = defineProps({
  requisitionId: {
    type: [Number, String],
    required: true
  }
})

const authStore = useAuthStore()
const authority = authStore.authority
const router = useRouter()

const requisitionDetail = ref(null)
const showRejectDialog = ref(false)
const showApproveDialog = ref(false)

const status = computed(() => requisitionDetail.value?.status || '')
const isSaved = computed(() => status.value === 'SAVED')
const isSubmitted = computed(() => status.value === 'SUBMITTED')
const isGeneralManager = computed(() => authority === 'GENERAL_MANAGER')
const isSeniorManager = computed(() => authority === 'SENIOR_MANAGER')

const reload = async () => {
  const id = Number(props.requisitionId)
  if (!id) return

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
      approvedAt: requisitionInfo.modifiedAt,
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
    console.error('❌ 재조회 실패:', e)
  }
}

onMounted(reload)

const handleSubmit = async () => {
  try {
    const res = await submittedRequisition(props.requisitionId)
    if (res.data?.success) {
      alert('상신되었습니다.')
      await reload()
    } else {
      alert('상신 실패: ' + (res.data?.message || '알 수 없는 오류'))
    }
  } catch (e) {
    console.error('상신 실패:', e)
    alert('상신 실패: 서버 오류')
  }
}

const openApproveDialog = () => {
  console.log('✅ openApproveDialog 호출됨')
  showApproveDialog.value = true
}

const handleApprove = async () => {
  console.log('✅ handleApprove 호출됨')
  try {
    const res = await approveRequisition(props.requisitionId)
    if (res.data?.success) {
      alert('승인되었습니다.')
      showApproveDialog.value = false
      await reload()
    } else {
      alert('승인 실패: ' + (res.data?.message || '알 수 없는 오류'))
    }
  } catch (e) {
    console.error('승인 실패:', e)
    alert('승인 실패: 서버 오류')
  }
}

const openRejectDialog = () => {
  console.log('✅ openRejectDialog 호출됨')
  showRejectDialog.value = true
}

const handleReject = async (reason) => {
  console.log('✅ handleReject 호출됨, 입력 사유:', reason)
  try {
    const res = await rejectRequisition(props.requisitionId, reason)
    if (res.data?.success) {
      alert('반려되었습니다.')
      showRejectDialog.value = false
      await reload()
    } else {
      alert('반려 실패: ' + (res.data?.message || '알 수 없는 오류'))
    }
  } catch (e) {
    console.error('반려 실패:', e)
    alert('반려 실패: 서버 오류')
  }
}

const handleDelete = async () => {
  try {
    const res = await deleteRequisition(props.requisitionId)
    if (res.data?.success) {
      alert('삭제되었습니다.')
      router.push('/requisitions')
    } else {
      alert('삭제 실패: ' + (res.data?.message || '알 수 없는 오류'))
    }
  } catch (e) {
    console.error('삭제 실패:', e)
    alert('삭제 실패: 서버 오류')
  }
}

const handleEdit = () => {
  router.push(`/requisitions/edit/${props.requisitionId}`)
}
</script>
