<template>
  <RegisterInfoGroup title="주문 관련 정보">
    <div class="grid grid-2 gap-6">
      <SearchFieldWithButton
          label="거래처명"
          v-model="vendorKeyword"
          placeholder="검색할 거래처명을 입력하세요"
          :readonly="false"
          @search="handleSearchVendor"
      />

      <SearchFieldWithButton
          label="창고명"
          v-model="warehouseKeyword"
          placeholder="검색할 창고명을 입력하세요"
          :readonly="false"
          @search="handleSearchWarehouse"
      />

      <SelectField
          label="주문 타입"
          :model-value="orderCategory"
          :options="orderCategoryOptions"
          @update:model-value="val => emit('update:orderCategory', val)"
      />

      <AddressSearchField
          label="주소"
          :model-value="address"
          @update:model-value="val => emit('update:address', val)"
      />
    </div>
  </RegisterInfoGroup>
</template>

<script setup>
import {computed, ref} from "vue"

import RegisterInfoGroup from "@/components/layout/registerview/RegisterInfoGroup.vue"
import SearchFieldWithButton from "@/components/common/fields/SearchFieldWithButton.vue"
import DatePickerField from "@/components/common/fields/DatePickerField.vue"
import SelectField from "@/components/common/fields/SelectField.vue"
import AddressSearchField from "@/components/common/fields/AddressSearchField.vue"

function handleSearchVendor() {
  emit('searchVendor')  // 상위 컴포넌트에서 RightPanel 열도록 유도
}

function handleSearchWarehouse() {
  emit('searchWarehouse')
}

const vendorKeyword = ref('')
const warehouseKeyword = ref('')


const props = defineProps({
  vendor: Object,
  warehouse: Object,
  deliveryDate: String,
  orderCategory: String,
  address: String
})

const emit = defineEmits([
  'update:vendor',
  'update:warehouse',
  'update:deliveryDate',
  'update:orderCategory',
  'update:address',
  'searchVendor',
  'searchWarehouse'
])

const orderCategoryOptions = [
  { label: '공급업체', value: '공급업체' },
  { label: '물류', value: '물류' },
  { label: '기타', value: '기타' }
]
</script>
