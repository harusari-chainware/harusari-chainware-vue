<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { approvePurchase, getPurchaseOrderDetail, rejectPurchase } from '@/features/purchase/PurchaseApi.js'

import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from "@/components/common/StatusButton.vue"
import PurchaseOrderDetailBasic from '../components/PurchaseOrderDetailBasic.vue'
import PurchaseOrderDetailDetail from '../components/PurchaseOrderDetailDetail.vue'
import { useAuthStore } from "@/features/auth/useAuthStore.js"
import ConfirmModal from "@/components/common/ConfirmModal.vue"
import RejectReasonModal from "@/components/common/RejectReasonModal.vue"
import { useToast } from "vue-toastification"

const props = defineProps({
  purchaseOrderId: {
    type: [Number, String],
    required: true,
  }
})

const toast = useToast()
const purchaseDetail = ref(null)
const isLoading = ref(true)

const authStore = useAuthStore()
const authority = authStore.authority

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
  title: '발주 반려',
  onConfirm: async (reason) => {
    try {
      await rejectPurchase(props.purchaseOrderId, reason)
      toast.success('발주가 반려되었습니다.')
      modalReject.visible = false
      location.reload()
    } catch (e) {
      toast.error('반려에 실패했습니다.')
      console.error(e)
    }
  }
})

/**
 * 제품 항목을 detail table용 item 구조로 변환
 * @param {Array} products
 */
function mapProductsToItems(products) {
  return products.map(p => ({
    ...p,
    totalPrice: p.unitPrice * p.quantity || 0,
    productCode: p.productCode,
    moq: p.moq
  }))
}

onMounted(async () => {
  const id = Number(props.purchaseOrderId)
  if (!id) {
    console.error(" 유효하지 않은 ID")
    return
  }

  try {
    const res = await getPurchaseOrderDetail(id)
    const {
      purchaseOrderInfo,
      drafter,
      vendor,
      warehouse,
      products
    } = res.data.data

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
      items: mapProductsToItems(products)
    }

    console.log(" 최종 바인딩 데이터:", purchaseDetail.value)
  } catch (e) {
    console.error(" 상세 조회 실패", e)
  } finally {
    isLoading.value = false
  }
})

const handleApprove = () => {
  modal.title = '발주 승인'
  modal.description = '해당 발주를 승인하시겠습니까?'
  modal.onConfirm = async () => {
    try {
      await approvePurchase(props.purchaseOrderId)
      toast.success('발주가 승인되었습니다.')
      modal.visible = false
      location.reload()
    } catch (e) {
      toast.error('승인에 실패했습니다.')
      console.error(e)
    }
  }
  modal.visible = true
}

const handleReject = () => {
  modalReject.visible = true
}
</script>

<template>
  <DetailLayout
      title="발주 상세"
      description="발주의 기본 정보와 상세 내용을 확인할 수 있습니다."
  >
    <!-- 상단 버튼 영역 -->
    <template #actions>
      <!-- 일반/책임 관리자: 요청 상태 -->
      <template v-if="isRequested && isManager">
        <StatusButton type="warning" @click="handleUpdate">수정</StatusButton>
        <StatusButton type="danger" @click="handleCancel">취소</StatusButton>
      </template>

      <!-- 거래처 담당자: 요청 상태 → 승인/반려 -->
      <template v-if="isRequested && isVendor">
        <StatusButton type="approve" @click="handleApprove">승인</StatusButton>
        <StatusButton type="reject" @click="handleReject">반려</StatusButton>
      </template>

      <!-- 거래처 담당자: 승인 상태 → 출고 -->
      <template v-if="isApproved && isVendor">
        <StatusButton type="return" @click="handleShipped">출고</StatusButton>
      </template>

      <!-- 창고 담당자: 출고 상태 → 입고 -->
      <template v-if="isShipped && isWarehouse">
        <StatusButton type="return" @click="handleInbound">입고</StatusButton>
      </template>
    </template>

    <!-- 기본 정보 -->
    <template #basic>
      <PurchaseOrderDetailBasic
          v-if="purchaseDetail"
          :purchaseDetail="purchaseDetail"
      />
    </template>

    <!-- 상세 정보 테이블 -->
    <template #detail>
      <PurchaseOrderDetailDetail
          v-if="purchaseDetail && purchaseDetail.items?.length"
          :items="purchaseDetail.items"
      />
      <p v-else-if="isLoading">로딩 중입니다...</p>
      <p v-else>데이터가 없습니다</p>
    </template>

    <!-- 승인 모달 -->
    <ConfirmModal
        v-model="modal.visible"
        :title="modal.title"
        :description="modal.description"
        @confirm="modal.onConfirm"
    />

    <!-- 반려 모달 -->
    <RejectReasonModal
        v-model="modalReject.visible"
        :title="modalReject.title"
        @confirm="modalReject.onConfirm"
    />
  </DetailLayout>
</template>
