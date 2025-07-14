<template>
  <div class="search-table-wrapper">
    <GenericTable :items="tableConfig.data" :columns="tableConfig.columns">
      <!-- status 커스텀 렌더링 -->
      <template v-if="tableConfig.customSlots.includes('status')" #cell-status="{ value }">
        <StatusBadge :status="value" />
      </template>
      <template v-if="tableConfig.customSlots.includes('storeType')" #cell-storeType="{ value }">
        <StatusBadge :status="value" />
      </template>

      <template v-if="tableConfig.customSlots.includes('basePrice')" #cell-basePrice="{ value }">
        {{ formatCurrency(value) }}
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

    <!-- Pagination 컴포넌트 조건부 렌더링 -->
    <Pagination
        v-if="tableConfig.usePagination"
        v-model="currentPage"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
    />

    <!-- 다중 선택 시 제출 버튼 노출 -->
    <div v-if="props.multi" class="submit-area">
      <StatusButton type="primary" @click="submitSelected">제출</StatusButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import StatusButton from "@/components/common/StatusButton.vue"
import GenericSearchButton from "@/components/common/GenericSearchButton.vue"
import Pagination from '@/components/common/Pagination.vue'
import { fetchActiveProducts } from '@/features/order/api'
import { formatCurrency } from "@/utils/tableUtils.js"

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

const selectedItems = ref([...props.selected])
const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const tableConfig = ref({
  columns: [],
  data: [],
  customSlots: [],
  usePagination: false
})

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
  if (!item || typeof item !== 'object') return
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

async function fetchDataByType(type) {
  switch (type) {
    case 'product': {
      try {
        const res = await fetchActiveProducts({ page: currentPage.value, size: itemsPerPage })
        const { products, pagination } = res.data.data

        totalItems.value = pagination.totalItems

        tableConfig.value = {
          columns: [
            { label: '제품코드', key: 'productCode' },
            { label: '제품명', key: 'productName' },
            { label: '보관방식', key: 'storeType', slot: 'storeType' },
            { label: '단위', key: 'unit' },
            { label: '기준단가', key: 'basePrice', slot: 'basePrice' },
            { label: '', key: 'actions', slot: 'actions' }
          ],
          data: products.map(p => ({
            id: p.productId,
            productId: p.productId,
            productName: p.productName,
            productCode: p.productCode,
            storeType: p.storeType,
            unit: `${p.unitQuantity}${p.unitSpec}`,
            unitQuantity: p.unitQuantity,
            unitSpec: p.unitSpec,
            basePrice: p.basePrice
          })),
          customSlots: ['storeType', 'basePrice'],
          usePagination: true
        }
      } catch (e) {
        console.error('제품 목록 불러오기 실패:', e)
      }
      break
    }

    default:
      tableConfig.value = {
        columns: [],
        data: [],
        customSlots: [],
        usePagination: false
      }
  }
}

watch(currentPage, async () => {
  if (tableConfig.value.usePagination) {
    await fetchDataByType(props.type)
  }
})

onMounted(async () => {
  await fetchDataByType(props.type)
})
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
