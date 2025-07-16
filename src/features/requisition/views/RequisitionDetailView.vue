<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import RejectReasonModal from '@/components/common/RejectReasonModal.vue'
import SkeletonDetail from '@/components/common/SkeletonDetail.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import { useAuthStore } from '@/features/auth/useAuthStore.js'
import { useToast} from "vue-toastification";


const toast = useToast()

const props = defineProps({
  requisitionId: {
    type: [Number, String],
    required: true
  }
})

const requisitionDetail = ref(null)
const authStore = useAuthStore()
const authority = authStore.authority
const router = useRouter()

const status = computed(() => requisitionDetail.value?.status || '')
const isSaved = computed(() => status.value === 'SAVED')
const isSubmitted = computed(() => status.value === 'SUBMITTED')
const isGeneralManager = computed(() => authority === 'GENERAL_MANAGER')
const isSeniorManager = computed(() => authority === 'SENIOR_MANAGER')

// 승인/상신 공통 Confirm 모달
const modal = reactive({
  visible: false,
  title: '',
  description: '',
  onConfirm: () => {}
})

// 반려 사유 모달
const modalReject = reactive({
  visible: false,
  title: '반려 사유를 입력해주세요.',
  onConfirm: async (reason) => {
    try {
      const res = await rejectRequisition(props.requisitionId, reason)
      if (res.data?.success) {
        toast.success('반려되었습니다.')
        modal.visible = false
        await reload()
      } else {
        toast.error('반려 실패: ' + (res.data?.message || '알 수 없는 오류'))
      }
    } catch (e) {
      toast.error('반려 실패: 서버 오류')
      console.error('반려 실패:', e)
    }
  }
})


// 삭제 사유 모달
const modalDelete = reactive({
  visible: false,
  title: '삭제 사유를 입력해주세요.',
  onConfirm: async (reason) => {
    try {
      const res = await deleteRequisition(props.requisitionId, reason)
      if (res.data?.success) {
        toast.success('삭제되었습니다.')
        modal.visible = false
        router.push('/requisitions/list')
      } else {
        toast.error('삭제 실패: ' + (res.data?.message || '알 수 없는 오류'))
      }
    } catch (e) {
      toast.error('삭제 실패: 서버 오류')
      console.error('삭제 실패:', e)
    }
  }
})

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
    console.error(' 재조회 실패:', e)
  }
}

onMounted(reload)

// 상신 모달 열기
const openSubmitDialog = () => {
  modal.title = '상신하시겠습니까?'
  modal.description = '상신 후에는 수정이 불가능합니다.'
  modal.visible = true
  modal.onConfirm = async () => {
    try {
      const res = await submittedRequisition(props.requisitionId)
      if (res.data?.success) {
        toast.success('상신되었습니다.')
        modal.visible = false
        await reload()
      } else {
        toast.error('상신 실패: ' + (res.data?.message || '알 수 없는 오류'))
      }
    } catch (e) {
      console.error('상신 실패:', e)
      toast.error('상신 실패: 서버 오류')
    }
  }
}

// 승인 모달 열기
const openApproveDialog = () => {
  modal.title = '승인하시겠습니까?'
  modal.description = '승인 후에는 품의서를 수정할 수 없습니다.'
  modal.visible = true
  modal.onConfirm = async () => {
    try {
      const res = await approveRequisition(props.requisitionId)
      if (res.data?.success) {
        toast.success('승인되었습니다.')
        modal.visible = false
        await reload()
      } else {
        toast.error('승인 실패: ' + (res.data?.message || '알 수 없는 오류'))
      }
    } catch (e) {
      console.error('승인 실패:', e)
      toast.error('승인 실패: 서버 오류')
    }
  }
}

// 반려 모달 열기
const openRejectDialog = () => {
  modalReject.visible = true
}

// 삭제 모달 열기
const openDeleteDialog = () => {
  modalDelete.visible = true
}

// 수정
const handleEdit = () => {
  router.push(`/requisitions/edit/${props.requisitionId}`)
}
</script>

<template>
  <DetailLayout
      v-if="requisitionDetail"
      title="품의서 상세"
      description="품의 요청에 대한 기본 정보와 품목 내역을 확인할 수 있습니다."
  >
    <template #actions>
      <template v-if="isSaved && isGeneralManager">
        <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
        <StatusButton type="approve" @click="openSubmitDialog">상신</StatusButton>
        <StatusButton type="reject" @click="openDeleteDialog">삭제</StatusButton>
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
  </DetailLayout>

  <SkeletonDetail v-else />

  <!-- 모달들 -->
  <ConfirmModal
      v-model="modal.visible"
      :title="modal.title"
      :description="modal.description"
      @confirm="modal.onConfirm"
  />
  <RejectReasonModal
      v-model="modalReject.visible"
      :title="modalReject.title"
      @confirm="modalReject.onConfirm"
  />
  <RejectReasonModal
      v-model="modalDelete.visible"
      :title="modalDelete.title"
      @confirm="modalDelete.onConfirm"
  />
</template>
