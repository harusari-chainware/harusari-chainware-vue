<template>
  <DetailLayout
      title="발주 상세"
      description="발주의 기본 정보와 상세 내용을 확인할 수 있습니다."
  >
    <!-- 상단 버튼 영역 -->
    <template #actions>
      <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
      <StatusButton type="approve">승인</StatusButton>
      <StatusButton type="reject">반려</StatusButton>
      <StatusButton type="return">출고</StatusButton>
      <StatusButton type="return">입고</StatusButton>
    </template>


    <!-- 기본 정보 그룹들 -->
    <template #basic>
      <PurchaseOrderDetailBasic :purchaseDetail="purchaseDetail" />
    </template>

    <!-- 상세 정보 테이블 -->
    <template #detail>
      <!-- 상세 정보에 pagination 적용한다면 이걸로 -->
<!--      <OrderDetailDetail-->
<!--          v-model:page="page"-->
<!--          :items="pagedItems"-->
<!--          :total="purchase.items.length"-->
<!--          :items-per-page="itemsPerPage"-->
<!--      />-->

      <!-- 상세 정보에 pagination 필요 없으면 간단하게 -->
      <PurchaseOrderDetailDetail :items="purchaseDetail.items" />
    </template>
  </DetailLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPurchaseOrderDetail } from '@/features/purchase/PurchaseApi.js'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from "@/components/common/StatusButton.vue"
import PurchaseOrderDetailBasic from '../components/PurchaseOrderDetailBasic.vue'
import PurchaseOrderDetailDetail from '../components/PurchaseOrderDetailDetail.vue'

const route = useRoute()
const purchaseOrderId = route.params.purchaseOrderId || route.query.id
const purchaseDetail = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await getPurchaseOrderDetail(purchaseOrderId)
    purchaseDetail.value = res.data.data
  } catch (e) {
    console.error('상세 조회 실패', e)
  } finally {
    isLoading.value = false
  }
})
</script>
