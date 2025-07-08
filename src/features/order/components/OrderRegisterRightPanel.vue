<template>
  <RegisterRightPanel :title="panelTitle">
    <GenericSearchWrapper
        :type="type"
        :multi="multi"
        @select="onSelect"
    />
  </RegisterRightPanel>
</template>

<script setup>
import { computed } from 'vue'
import RegisterRightPanel from '@/components/layout/registerview/RegisterRightPanel.vue'
import GenericSearchWrapper from '@/components/common/GenericSearchWrapper.vue'

const props = defineProps({
  type: String,
  multi: Boolean
})
const emit = defineEmits(['select', 'close'])

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
  if (!props.multi) emit('close')
}
</script>
