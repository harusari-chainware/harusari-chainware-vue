<!-- components/requisition/register/RequisitionRegisterOrderInfo.vue -->
<script setup>
import { ref } from 'vue'
import CommonSearchField from '@/components/common/fields/SearchFieldWithButton.vue'
import DatePickerField from '@/components/common/fields/DatePickerField.vue'
import VendorSearchModal from '@/components/common/fields/VendorSearchModal.vue'
import WarehouseSearchModal from '@/components/common/fields/WarehouseSearchModal.vue'

const props = defineProps({
  vendor: Object,
  warehouse: Object,
  dueDate: String
})
const emit = defineEmits(['update:vendor', 'update:warehouse', 'update:dueDate'])

// 모달 상태
const showVendorModal = ref(false)
const showWarehouseModal = ref(false)

// 선택 이벤트
const selectVendor = (vendor) => {
  emit('update:vendor', vendor)
  showVendorModal.value = false
}
const selectWarehouse = (warehouse) => {
  emit('update:warehouse', warehouse)
  showWarehouseModal.value = false
}
</script>

<template>
  <div class="register-order-info">
    <CommonSearchField
        label="거래처"
        :displayValue="props.vendor?.name || '거래처를 선택하세요.'"
        @click="showVendorModal = true"
    />

    <CommonSearchField
        label="창고"
        :displayValue="props.warehouse?.name || '창고를 선택하세요.'"
        @click="showWarehouseModal = true"
    />

    <DatePickerField
        label="납기일"
        :modelValue="props.dueDate"
        @update:modelValue="emit('update:dueDate', $event)"
    />

    <VendorSearchModal
        v-if="showVendorModal"
        @select="selectVendor"
        @close="showVendorModal = false"
    />

    <WarehouseSearchModal
        v-if="showWarehouseModal"
        @select="selectWarehouse"
        @close="showWarehouseModal = false"
    />
  </div>
</template>
