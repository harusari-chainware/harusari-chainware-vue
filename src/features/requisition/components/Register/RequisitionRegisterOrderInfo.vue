<template>
  <RegisterInfoGroup title="주문 관련 정보">
    <div class="grid grid-2 gap-6">

      <!-- 거래처 선택 -->
      <FilterSearchModal
          label="거래처"
          :displayText="vendor?.vendorName || '거래처를 선택하세요'"
          @open="isVendorModalVisible = true"
      />

      <!-- 창고 선택 -->
      <FilterSearchModal
          label="창고"
          :displayText="warehouse?.warehouseName || '창고를 선택하세요'"
          @open="isWarehouseModalVisible = true"
      />

      <!-- 납기일 -->
      <DatePickerField
          label="납기일"
          :model-value="deliveryDate"
          :min-date="new Date()"
          @update:model-value="val => emit('update:deliveryDate', val)"
      />
    </div>

    <!-- 거래처 검색 모달 -->
    <VendorSearchModal
        :visible="isVendorModalVisible"
        @update:visible="val => (isVendorModalVisible = val)"
        @select="handleVendorSelect"
    />

    <!-- 창고 검색 모달 -->
    <WarehouseSearchModal
        :visible="isWarehouseModalVisible"
        @update:visible="val => (isWarehouseModalVisible = val)"
        @select="handleWarehouseSelect"
    />
  </RegisterInfoGroup>
</template>

<script setup>
import { ref } from 'vue'
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import FilterSearchModal from '@/components/common/filters/FilterSearchModal.vue'
import DatePickerField from '@/components/common/fields/DatePickerField.vue'
import VendorSearchModal from "@/components/common/fields/VendorSearchModal.vue";
import WarehouseSearchModal from "@/components/common/fields/WarehouseSearchModal.vue";

const props = defineProps({
  vendor: Object,
  warehouse: Object,
  deliveryDate: String,
})
const emit = defineEmits(['update:vendor', 'update:warehouse', 'update:deliveryDate'])

const isVendorModalVisible = ref(false)
const isWarehouseModalVisible = ref(false)

const vendor = ref(props.vendor || null)
const warehouse = ref(props.warehouse || null)

function handleVendorSelect(item) {
  vendor.value = item
  emit('update:vendor', item)
  isVendorModalVisible.value = false
}

function handleWarehouseSelect(item) {
  warehouse.value = item
  emit('update:warehouse', item)
  isWarehouseModalVisible.value = false
}
</script>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
