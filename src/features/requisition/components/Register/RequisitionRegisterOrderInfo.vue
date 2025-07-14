<template>
  <RegisterInfoGroup title="주문 관련 정보">
    <div class="grid grid-2 gap-6">
      <!-- 거래처 검색 필드 -->
      <AutoCompleteField
          id="vendor"
          label="거래처"
          placeholder="거래처명을 입력하세요"
          v-model="vendorKeyword"
          :fetchFn="fetchVendors"
          labelKey="vendorName"
          @select="onVendorSelect"
      />
<!--      :fetchFn="(params) => fetchVendors({ vendorName: params.vendorName })"-->

      <!-- 창고 검색 필드 -->
      <AutoCompleteField
          label="창고"
          v-model="warehouseKeyword"
          placeholder="창고명을 입력하세요"
          :fetchFn="fetchWarehouses"
          labelKey="warehouseName"
          idKey="warehouseId"
          @select="onSelectWarehouse"
      />

      <!-- 납기일 선택 -->
      <RegisterInfoGroup title="납기일">
        <DatePickerField
            label="납기일"
            :model-value="deliveryDate"
            @update:model-value="val => emit('update:deliveryDate', val)"
        />
      </RegisterInfoGroup>
    </div>
  </RegisterInfoGroup>
</template>

<script setup>
import { ref } from 'vue'
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import AutoCompleteField from '@/features/requisition/components/Register/AutoCompleteField.vue'
import DatePickerField from '@/components/common/fields/DatePickerField.vue'
import { fetchVendors } from '@/features/vendor/api.js'
import { fetchWarehouses } from '@/features/warehouse/api.js'

const props = defineProps({
  vendor: Object,
  warehouse: Object,
  deliveryDate: String,
})

const emit = defineEmits([
  'update:vendor',
  'update:warehouse',
  'update:deliveryDate',
])

const vendorKeyword = ref('')
const warehouseName = ref('')
const selectedWarehouse = ref(null)
const vendor = ref(null)
const warehouseKeyword = ref('')

function onVendorSelect(item) {
  vendor.value = {
    vendorId: item.vendorId ?? item.id,
    vendorName: item.vendorName ?? item.name,
  }
  vendorKeyword.value = vendor.value.vendorName
  emit('update:vendor', vendor.value)
  console.log('✅ 선택된 거래처:', vendor.value)
}

function onSelectWarehouse(item) {
  selectedWarehouse.value = {
    warehouseId: item.warehouseId ?? item.id,
    warehouseName: item.warehouseName ?? item.name,
  }
  warehouseKeyword.value = selectedWarehouse.value.warehouseName
  emit('update:warehouse', selectedWarehouse.value)
  console.log('✅ 선택된 창고:', selectedWarehouse.value)
}
</script>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
