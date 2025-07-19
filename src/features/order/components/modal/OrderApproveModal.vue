<template>
  <div class="modal-backdrop">
    <div class="modal-box large">
      <h2 class="modal-title">주문 승인</h2>
      <p>주문 가능한 창고를 선택해주세요. 창고 선택 시 위험 재고 정보를 확인할 수 있습니다.</p>

      <!-- 주문 가능 창고 테이블 -->
      <GenericTable
          :items="warehouses"
          :columns="warehouseColumns"
      >
        <template #cell-select="{ item }">
          <input
              type="radio"
              :value="item.warehouseId"
              v-model="selectedWarehouseId"
              @click.stop
          />
        </template>
        <template #cell-warehouseName="{ value }">
          <span>{{ value }}</span>
        </template>
        <template #cell-riskyCount="{ item }">
          {{ item.riskyProducts.length }}
        </template>
        <template #default="{ item }">
          <tr
              @click="selectedWarehouseId = item.warehouseId"
              :class="{ selected: item.warehouseId === selectedWarehouseId }"
          />
        </template>
      </GenericTable>

      <!-- 위험 재고 상세 테이블 -->
      <div v-if="selectedWarehouse?.riskyProducts.length" class="risky-products">
        <h4>위험 재고 제품</h4>
        <GenericTable
            :items="selectedWarehouse.riskyProducts"
            :columns="riskyProductColumns"
        />
      </div>

      <div class="modal-actions">
        <StatusButton type="default" @click="$emit('close')">취소</StatusButton>
        <StatusButton type="approve" v-if="selectedWarehouseId" @click="handleApprove">승인</StatusButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { fetchAvailableWarehouses, approveOrder } from '@/features/order/api.js'
import StatusButton from "@/components/common/StatusButton.vue";
import GenericTable from "@/components/common/GenericTable.vue";
import { useToast } from 'vue-toastification'

const props = defineProps({ orderId: Number })
const emit = defineEmits(['close', 'approved'])
const toast = useToast()

const warehouses = ref([])
const selectedWarehouseId = ref(null)

const selectedWarehouse = computed(() =>
    warehouses.value.find(w => w.warehouseId === selectedWarehouseId.value)
)

onMounted(async () => {
  try {
    const res = await fetchAvailableWarehouses(props.orderId)
    warehouses.value = res.data.data
  } catch (e) {
    toast.success('승인 가능 창고 조회 실패: \n' + (e.response?.data?.message || e.message))
    // alert('승인 가능 창고 조회 실패: ' + (e.response?.data?.message || e.message))
  }
})

const handleApprove = async () => {
  if (!selectedWarehouseId.value) return
  try {
    await approveOrder(props.orderId, {
      warehouseId: selectedWarehouseId.value
    })
    emit('approved')
    emit('close')
  } catch (e) {
    toast.error('주문 승인 실패: \n' + (e.response?.data?.message || e.message))
    // alert('주문 승인 실패: ' + (e.response?.data?.message || e.message))
  }
}

const warehouseColumns = [
  { key: 'select', label: '선택', align: 'center' },
  { key: 'warehouseName', label: '창고명', align: 'center' },
  { key: 'riskyCount', label: '위험 재고 수', align: 'center' }
]

const riskyProductColumns = [
  { key: 'productName', label: '제품명', align: 'center' },
  { key: 'productCode', label: '제품코드', align: 'center' },
  { key: 'orderedQuantity', label: '주문 수량', align: 'center' },
  { key: 'safetyQuantity', label: '안전재고', align: 'center' },
  { key: 'availableQuantity', label: '승인 이후 가용재고', align: 'center' }
]
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(40, 50, 65, 0.19);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box.large {
  background: var(--color-white);
  padding: 28px;
  max-width: 680px;
  width: 95%;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(16, 185, 129, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 14px;
  color: #065f46; /* 승인 컬러 */
}

.modal-box p {
  font-size: 1rem;
  margin-bottom: 16px;
}

.risky-products {
  margin-top: 28px;
}

.selected {
  background-color: #d1fae5 !important;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>

