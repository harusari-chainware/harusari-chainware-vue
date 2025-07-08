<template>
  <div class="search-table-wrapper">
    <GenericTable :items="tableConfig.data" :columns="tableConfig.columns">
      <!-- status 커스텀 렌더링 -->
      <template v-if="tableConfig.customSlots.includes('status')" #cell-status="{ value }">
        <StatusBadge :status="value" />
      </template>

      <!-- 선택 버튼 -->
      <template #cell-actions="{ item }">
        <StatusButton
            type="selected"
            :class="{ selected: isSelected(item) }"
            @click="handleClick(item)"
        >
          {{ isSelected(item) ? '선택됨' : '선택' }}
        </StatusButton>
      </template>
    </GenericTable>

    <!-- 다중 선택 시 제출 버튼 노출 -->
    <div v-if="props.multi" class="submit-area">
      <StatusButton type="primary" @click="submitSelected">제출</StatusButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import StatusButton from "@/components/common/StatusButton.vue";
import { searchTableConfigs } from '@/constants/dummy/orderSearchTableConfig.js'

const props = defineProps({
  type: String,
  multi: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const tableConfig = computed(() => searchTableConfigs[props.type] || {})
const selectedItems = ref([])

function isSelected(item) {
  return selectedItems.value.some(i => i.id === item.id)
}

const submitSelected = () => {
  emit('select', [...selectedItems.value])
}

function handleClick(item) {
  if (props.multi) {
    const index = selectedItems.value.findIndex(i => i.id === item.id)
    if (index >= 0) {
      selectedItems.value.splice(index, 1)
    } else {
      selectedItems.value.push(item)
    }
    emit('select', [...selectedItems.value])
  } else {
    emit('select', item)
  }
}
</script>

<style scoped>
.status-button.selected {
  background-color: var(--color-primary-dark);
  color: white;
}

.search-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submit-area {
  display: flex;
  justify-content: flex-end;
}
</style>
