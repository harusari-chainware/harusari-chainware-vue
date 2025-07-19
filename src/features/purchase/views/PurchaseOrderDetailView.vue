<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getPurchaseOrderDetail,
  approvePurchase,
  rejectPurchase,
  updatePurchaseOrder,
  cancelPurchaseOrder,
  shippedPurchaseOrder,
  inboundPurchaseOrder
} from '@/features/purchase/PurchaseApi.js'

import DetailLayout from '@/components/layout/DetailLayout.vue'
import PurchaseOrderDetailBasic from '../components/PurchaseOrderDetailBasic.vue'
import PurchaseOrderDetailDetail from '../components/PurchaseOrderDetailDetail.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import RejectReasonModal from '@/components/common/RejectReasonModal.vue'
import SkeletonDetail from '@/components/common/SkeletonDetail.vue'
import StatusButton from '@/components/common/StatusButton.vue'
import InboundModal from "@/features/purchase/components/InboundModal.vue";
import { useAuthStore } from '@/features/auth/useAuthStore.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const authority = authStore.authority

const props = defineProps({
  purchaseOrderId: {
    type: [Number, String],
    required: true
  }
})

const purchaseDetail = ref(null)
const modalInbound = ref(false)

const status = computed(() => purchaseDetail.value?.status || '')
const isRequested = computed(() => status.value === 'REQUESTED')
const isApproved = computed(() => status.value === 'APPROVED')
const isShipped = computed(() => status.value === 'SHIPPED')

const isGeneralManager = computed(() => authority === 'GENERAL_MANAGER')
const isSeniorManager = computed(() => authority === 'SENIOR_MANAGER')
const isVendor = computed(() => authority === 'VENDOR_MANAGER')
const isWarehouse = computed(() => authority === 'WAREHOUSE_MANAGER')
const isManager = computed(() => isGeneralManager.value || isSeniorManager.value)

const modal = reactive({
  visible: false,
  title: '',
  description: '',
  onConfirm: () => {}
})

const modalReject = reactive({
  visible: false,
  title: '반려 사유를 입력해주세요.',
  onConfirm: async (reason) => {
    try {
      await rejectPurchase(props.purchaseOrderId, reason)
      toast.success('반려되었습니다.')
      modalReject.visible = false
      await reload()
    } catch (e) {
      toast.error('반려 실패: ' + (e.response?.data?.message || '서버 오류'))
    }
  }
})

const modalCancel = reactive({
  visible: false,
  title: '취소 사유를 입력해주세요.',
  onConfirm: async (reason) => {
    try {
      await cancelPurchaseOrder(props.purchaseOrderId, { cancelReason: reason })
      toast.success('취소되었습니다.')
      modalCancel.visible = false
      await reload()
    } catch (e) {
      toast.error('취소 실패: ' + (e.response?.data?.message || '서버 오류'))
    }
  }
})

const reload = async () => {
  const id = Number(props.purchaseOrderId)
  if (!id) return

  try {
    const res = await getPurchaseOrderDetail(id)
    const { purchaseOrderInfo, drafter, vendor, warehouse, products } = res.data.data

    purchaseDetail.value = {
      purchaseOrderId: purchaseOrderInfo.purchaseOrderId,
      purchaseOrderCode: purchaseOrderInfo.purchaseOrderCode,
      requisitionCode: purchaseOrderInfo.requisitionCode,
      status: purchaseOrderInfo.status,
      dueDate: purchaseOrderInfo.dueDate,
      createdAt: purchaseOrderInfo.createdAt,
      submittedAt: purchaseOrderInfo.submittedAt,
      approvedAt: purchaseOrderInfo.approvedAt,
      shippedAt: purchaseOrderInfo.shippedAt,
      drafter: {
        name: drafter.name,
        position: drafter.position,
        email: drafter.email,
        contact: drafter.contact
      },
      vendor: {
        name: vendor.name,
        type: vendor.type,
        managerName: vendor.managerName,
        vendorContact: vendor.vendorContact
      },
      warehouse: {
        name: warehouse.name,
        managerName: warehouse.managerName,
        warehouseContact: warehouse.warehouseContact
      },
      totalAmount: purchaseOrderInfo.totalAmount,
      totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
      items: products.map((item, idx) => ({
        index: idx,
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity || 0,
        purchaseOrderDetailId: item.purchaseOrderDetailId
      }))
    }
  } catch (e) {
    toast.error('상세 조회 실패')
    console.error(e)
  }
}

onMounted(reload)

const openApproveDialog = () => {
  modal.title = '승인하시겠습니까?'
  modal.description = '승인 후에는 발주서를 수정할 수 없습니다.'
  modal.visible = true
  modal.onConfirm = async () => {
    try {
      await approvePurchase(props.purchaseOrderId)
      toast.success('승인되었습니다.')
      modal.visible = false
      await reload()
    } catch (e) {
      toast.error('승인 실패: ' + (e.response?.data?.message || '서버 오류'))
    }
  }
}

const openRejectDialog = () => {
  modalReject.visible = true
}

const openCancelDialog = () => {
  modalCancel.visible = true
}

const openUpdateDialog = () => {
  modal.title = '발주서를 수정하시겠습니까?'
  modal.description = '수정된 정보가 반영됩니다.'
  modal.visible = true
  modal.onConfirm = async () => {
    try {
      await updatePurchaseOrder(props.purchaseOrderId, {
        warehouseId: purchaseDetail.value.warehouse?.id || null,
        items: purchaseDetail.value.items.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice
        }))
      })
      toast.success('수정되었습니다.')
      modal.visible = false
      await reload()
    } catch (e) {
      toast.error('수정 실패: ' + (e.response?.data?.message || '서버 오류'))
    }
  }
}

const openShippedDialog = () => {
  modal.title = '출고 처리하시겠습니까?'
  modal.description = '해당 발주를 출고 처리합니다.'
  modal.visible = true
  modal.onConfirm = async () => {
    try {
      await shippedPurchaseOrder(props.purchaseOrderId)
      toast.success('출고 완료되었습니다.')
      modal.visible = false
      await reload()
    } catch (e) {
      toast.error('출고 실패: ' + (e.response?.data?.message || '서버 오류'))
    }
  }
}

// 입고
const openInboundDialog = () => {
  modalInbound.value = true
  console.log('제품 item:', purchaseDetail.value.items)
}

const handleInboundSubmit = async (products) => {
  try {
    await inboundPurchaseOrder(props.purchaseOrderId, { products })
    toast.success('입고 완료되었습니다.')
    modalInbound.value = false
    await reload()
  } catch (e) {
    toast.error('입고 실패: ' + (e.response?.data?.message || '서버 오류'))
  }
}
</script>

<template>
  <DetailLayout
      v-if="purchaseDetail"
      title="발주 상세"
      description="발주 요청에 대한 기본 정보와 품목 내역을 확인할 수 있습니다."
  >
    <template #actions>
      <template v-if="isRequested && isManager">
        <StatusButton type="warning" @click="openUpdateDialog">수정</StatusButton>
        <StatusButton type="danger" @click="openCancelDialog">취소</StatusButton>
      </template>

      <template v-if="isRequested && isVendor">
        <StatusButton type="approve" @click="openApproveDialog">승인</StatusButton>
        <StatusButton type="reject" @click="openRejectDialog">반려</StatusButton>
      </template>

      <template v-if="isApproved && isVendor">
        <StatusButton type="return" @click="openShippedDialog">출고</StatusButton>
      </template>

      <template v-if="isShipped && isWarehouse">
        <StatusButton type="return" @click="openInboundDialog">입고</StatusButton>
      </template>
    </template>

    <template #basic>
      <PurchaseOrderDetailBasic :purchaseDetail="purchaseDetail" />
    </template>

    <template #detail>
      <PurchaseOrderDetailDetail :items="purchaseDetail.items" />
    </template>
  </DetailLayout>

  <SkeletonDetail v-else />

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
      v-model="modalCancel.visible"
      :title="modalCancel.title"
      @confirm="modalCancel.onConfirm"
  />

  <!-- 유통기한 입력용 입고 모달 -->
  <InboundModal
      v-if="modalInbound"
      :items="purchaseDetail.items"
      @submit="handleInboundSubmit"
      @cancel="modalInbound = false"
  />
</template>
