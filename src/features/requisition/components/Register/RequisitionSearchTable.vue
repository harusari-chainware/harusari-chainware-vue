<template>
  <div class="search-table-wrapper">
    <template v-if="emptyMessage">
      <p class="empty-text">{{ emptyMessage }}</p>
    </template>

    <template v-else>
      <GenericTable :items="tableConfig.data" :columns="tableConfig.columns">
        <template v-if="tableConfig.customSlots.includes('status')" #cell-status="{ value }">
          <StatusBadge :status="value" />
        </template>

        <template v-if="tableConfig.customSlots.includes('storeType')" #cell-storeType="{ value }">
          <StatusBadge :status="value" />
        </template>

        <template v-if="tableConfig.customSlots.includes('basePrice')" #cell-basePrice="{ value }">
          {{ formatCurrency(value) }}
        </template>

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

      <Pagination
          v-if="tableConfig.usePagination"
          v-model="currentPage"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
      />

      <!--  다중 선택일 때만 제출 버튼 노출 -->
      <div v-if="props.multi" class="submit-area">
        <StatusButton type="primary" @click="submitSelected">제출</StatusButton>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import GenericTable from '@/components/common/GenericTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import StatusButton from "@/components/common/StatusButton.vue"
import GenericSearchButton from "@/components/common/GenericSearchButton.vue"
import Pagination from '@/components/common/Pagination.vue'
import { fetchContracts } from '@/features/contract/api.js'
import { formatCurrency } from "@/utils/tableUtils.js"

const props = defineProps({
  type: String,
  multi: { type: Boolean, default: false },
  selected: { type: Array, default: () => [] },
  vendorId: { type: Number, default: null }
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

const emptyMessage = ref('')

watch(() => props.selected, val => {
  selectedItems.value = [...val]
})

function isSelected(item) {
  return selectedItems.value.some(i => i.id === item.id)
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
    emit('select', item) // 단일 선택일 땐 바로 전송
  }
}

const submitSelected = () => {
  emit('select', [...selectedItems.value])
}

async function fetchDataByType(type) {
  switch (type) {
    case 'product': {
      if (!props.vendorId) {
        tableConfig.value = {
          columns: [],
          data: [],
          customSlots: [],
          usePagination: false
        }
        emptyMessage.value = '거래처를 먼저 선택하세요.'
        return
      }

      try {
        const res = await fetchContracts({
          vendorId: props.vendorId,
          page: currentPage.value,
          size: itemsPerPage
        })

        const { content, pagination } = res.data.data
        totalItems.value = pagination.totalElements

        tableConfig.value = {
          columns: [
            { label: '제품명', key: 'productName' },
            { label: '기준단가', key: 'basePrice', slot: 'basePrice' },
            { label: '계약단가', key: 'contractPrice' },
            { label: '최소주문수량', key: 'minOrderQty' },
            { label: '납기일(일)', key: 'leadTime' },
            { label: '', key: 'actions', slot: 'actions' }
          ],
          data: content.map(p => ({
            id: p.contractId,
            contractId: p.contractId,
            productName: p.productName,
            basePrice: p.basePrice,
            contractPrice: p.contractPrice,
            minOrderQty: p.minOrderQty,
            leadTime: p.leadTime
          })),
          customSlots: ['basePrice'],
          usePagination: true
        }

        emptyMessage.value = content.length === 0 ? '계약된 제품이 없습니다.' : ''
      } catch (e) {
        console.error('제품 목록 불러오기 실패:', e)
        emptyMessage.value = '계약 제품 조회 중 오류가 발생했습니다.'
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
      emptyMessage.value = '해당 항목은 지원되지 않습니다.'
  }
}

watch(currentPage, async () => {
  if (tableConfig.value.usePagination) {
    await fetchDataByType(props.type)
  }
})

watch(() => props.vendorId, async () => {
  currentPage.value = 1
  await fetchDataByType(props.type)
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

.empty-text {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.95rem;
}
</style>
