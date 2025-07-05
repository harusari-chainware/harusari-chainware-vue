<template>
  <DetailLayout
      title="주문 상세"
      description="주문의 기본 정보와 상세 내용을 확인할 수 있습니다."
  >
    <!-- 상단 버튼 영역 -->
    <template #actions>
      <StatusButton type="primary" @click="handleEdit">수정</StatusButton>
      <StatusButton type="approve">승인</StatusButton>
      <StatusButton type="reject">반려</StatusButton>
      <StatusButton type="return">반품하기</StatusButton>
    </template>


    <!-- 기본 정보 그룹들 -->
    <template #basic>
      <OrderDetailBasic :order="order" />
    </template>

    <!-- 상세 정보 테이블 -->
    <template #detail>
      <!-- 상세 정보에 pagination 적용한다면 이걸로 -->
<!--      <OrderDetailDetail-->
<!--          v-model:page="page"-->
<!--          :items="pagedItems"-->
<!--          :total="order.items.length"-->
<!--          :items-per-page="itemsPerPage"-->
<!--      />-->

      <!-- 상세 정보에 pagination 필요 없으면 간단하게 -->
      <OrderDetailDetail :items="order.items" />
    </template>
  </DetailLayout>
</template>

<script setup>
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusButton from "@/components/common/StatusButton.vue";
import OrderDetailBasic from '../components/OrderDetailBasic.vue'
import OrderDetailDetail from '../components/OrderDetailDetail.vue'
import { dummyOrderDetail } from '@/constants/dummy/orderDetail'

import { ref, computed } from 'vue'

const order = dummyOrderDetail

const handleEdit = () => {
  alert('수정 버튼 클릭됨')
}

// 상세 조회에서 pagination을 적용한다면 아래 내용 추가
const page = ref(1)
const itemsPerPage = 10

const pagedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return order.items.slice(start, start + itemsPerPage)
})

const handlePageChange = (newPage) => {
  page.value = newPage
}
</script>
