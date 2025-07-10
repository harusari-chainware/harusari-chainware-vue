<!-- components/requisition/register/RequisitionRegisterRightPanel.vue -->
<script setup>
import { ref, watch } from 'vue'
import { getContractProductsByVendor } from '@/features/contract/contractApi.js' // API 가정
import ProductCard from '@/components/common/fields/ProductCard.vue' // 공용 컴포넌트 가정

const props = defineProps({
  vendorId: Number
})
const emit = defineEmits(['addItem'])

const contractProducts = ref([])
const isLoading = ref(false)

// 벤더 변경 시 상품 조회
watch(
    () => props.vendorId,
    async (newId) => {
      if (!newId) {
        contractProducts.value = []
        return
      }
      isLoading.value = true
      try {
        const res = await getContractProductsByVendor(newId)
        contractProducts.value = res.data || []
      } catch (e) {
        console.error('❌ 계약 상품 조회 실패', e)
        contractProducts.value = []
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true }
)

// 품의 상세 리스트로 추가
const addToRequisition = (product) => {
  emit('addItem', product)
}
</script>

<template>
  <div class="right-panel">
    <div v-if="!vendorId" class="empty-text">거래처를 선택하세요.</div>

    <div v-else-if="isLoading" class="loading-text">로딩 중...</div>

    <div v-else-if="contractProducts.length === 0" class="empty-text">
      계약된 상품이 없습니다.
    </div>

    <div v-else class="product-list">
      <ProductCard
          v-for="item in contractProducts"
          :key="item.contractId"
          :product="item"
      >
        <template #actions>
          <button @click="addToRequisition(item)">추가</button>
        </template>
      </ProductCard>
    </div>
  </div>
</template>
