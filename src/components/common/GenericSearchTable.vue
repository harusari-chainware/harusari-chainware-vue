<template>
  <div class="search-table-wrapper">
    <GenericTable :items="tableConfig.data" :columns="tableConfig.columns">
      <!-- status 커스텀 렌더링 -->
      <template v-if="tableConfig.customSlots.includes('status')" #cell-status="{ value }">
        <StatusBadge :status="value" />
      </template>

      <!-- 선택 버튼 -->
      <template #cell-actions="{ item }">
        <GenericSearchButton
            type="selected"
            :class="{ selected: isSelected(item) }"
            @click="(event) => handleClickWithEvent(event, item)"
        >
          {{ isSelected(item) ? '선택됨' : '선택' }}
        </GenericSearchButton>
      </template>
    </GenericTable>

    <!-- 다중 선택 시 제출 버튼 노출 -->
    <div v-if="props.multi" class="submit-area">
      <StatusButton type="primary" @click="submitSelected">제출</StatusButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import StatusButton from "@/components/common/StatusButton.vue";
import { searchTableConfigs } from '@/constants/dummy/orderSearchTableConfig.js'
import GenericSearchButton from "@/components/common/GenericSearchButton.vue";

const props = defineProps({
  type: String,
  multi: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selected', 'select'])

const tableConfig = computed(() => searchTableConfigs[props.type] || {})
const selectedItems = ref([...props.selected])

watch(() => props.selected, val => {
  selectedItems.value = [...val]
})

function isSelected(item) {
  return selectedItems.value.some(i => i.id === item.id)
}

const submitSelected = () => {
  emit('select', [...selectedItems.value])
}

function handleClickWithEvent(event, item) {
  if (!item || typeof item !== 'object') {
    return
  }
  event.stopPropagation()
  event.preventDefault()

  if (props.multi) {
    const exists = selectedItems.value.some(i => i.id === item.id)
    if (exists) {
      selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
    } else {
      selectedItems.value = [...selectedItems.value, item]
    }

    emit('update:selected', [...selectedItems.value])
  } else {
    emit('select', item)
  }
}
</script>

<style scoped>
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
