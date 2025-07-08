<template>
  <RegisterRightPanel :title="panelTitle">
    <component
        :is="searchComponent"
        :multi="multi"
        @select="onSelect"
    />
  </RegisterRightPanel>
</template>

<script setup>
import RegisterRightPanel from '@/components/layout/registerview/RegisterRightPanel.vue'
import OrderSearchVendor from './registerview/OrderSearchVendor.vue'
import OrderSearchApprover from './registerview/OrderSearchApprover.vue'
import OrderSearchWarehouse from './registerview/OrderSearchWarehouse.vue'
import OrderSearchProduct from "@/features/order/components/registerview/OrderSearchProduct.vue";
import { computed } from "vue";

const props = defineProps({
  type: String, // 'vendor' | 'approver' | 'warehouse'
  multi: Boolean
})
const emit = defineEmits(['select', 'close'])

const searchComponent = computed(() => {
  switch (props.type) {
    case 'vendor': return OrderSearchVendor
    case 'approver': return OrderSearchApprover
    case 'warehouse': return OrderSearchWarehouse
    case 'product': return OrderSearchProduct
    default: return null
  }
})

const panelTitle = computed(() => {
  switch (props.type) {
    case 'vendor': return '거래처 검색'
    case 'approver': return '결재자 검색'
    case 'warehouse': return '창고 검색'
    case 'product': return '제품 검색'
    default: return ''
  }
})

function onSelect(payload) {
  emit('select', payload)
  // 다중 선택이 아닌 경우만 닫기
  if (!props.multi) emit('close')
}
</script>
