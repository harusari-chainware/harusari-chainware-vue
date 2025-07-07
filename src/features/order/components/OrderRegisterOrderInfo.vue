<template>
  <div class="info-card">
    <div class="info-header">주문 관련 정보</div>
    <div class="grid grid-2 gap-6">
      <SearchFieldWithButton
          label="거래처명"
          :model-value="localVendor.name"
          placeholder="거래처명 입력"
          @update:model-value="val => updateVendor('name', val)"
          @search="() => {
            console.log('[OrderInfo] 거래처 검색 버튼 클릭됨')
            emit('searchVendor')
          }"
      />
      <SearchFieldWithButton
          label="창고명"
          :model-value="localWarehouse.name"
          placeholder="창고명 입력"
          @update:model-value="val => updateWarehouse('name', val)"
          @search="emit('searchWarehouse')"
      />
      <DatePickerField
          label="납기일"
          :model-value="deliveryDate"
          @update:model-value="val => emit('update:deliveryDate', val)"
      />
      <SelectField
          label="주문 타입"
          :model-value="orderCategory"
          :options="orderCategoryOptions"
          @update:model-value="val => emit('update:orderCategory', val)"
      />
      <InputField
          label="메모"
          placeholder="메모 입력"
          :model-value="memo"
          @update:model-value="val => emit('update:memo', val)"
      />
      <AddressSearchField
          label="주소"
          :model-value="address"
          @update:model-value="val => emit('update:address', val)"
      />
      <FileUploadField
          label="첨부파일"
          :model-value="attachments"
          @update:model-value="val => emit('update:attachments', val)"
      />
    </div>
  </div>
</template>

<script setup>
import SearchFieldWithButton from '@/components/common/fields/SearchFieldWithButton.vue'
import DatePickerField from '@/components/common/fields/DatePickerField.vue'
import SelectField from '@/components/common/fields/SelectField.vue'
import InputField from '@/components/common/fields/InputField.vue'
import AddressSearchField from '@/components/common/fields/AddressSearchField.vue'
import FileUploadField from '@/components/common/fields/FileUploadField.vue'
import { computed } from "vue";

const props = defineProps({
  vendor: Object,
  warehouse: Object,
  deliveryDate: String,
  orderCategory: String,
  memo: String,
  address: String,
  attachments: Array
})

const emit = defineEmits([
  'update:vendor',
  'update:warehouse',
  'update:deliveryDate',
  'update:orderCategory',
  'update:memo',
  'update:address',
  'update:attachments',
  'searchVendor',
  'searchWarehouse'
])

const orderCategoryOptions = [
  { label: '공급업체', value: '공급업체' },
  { label: '물류', value: '물류' },
  { label: '기타', value: '기타' }
]


const localVendor = computed(() => props.vendor || {})
const localWarehouse = props.warehouse

function updateVendor(field, value) {
  const updated = { ...localVendor.value, [field]: value }
  emit('update:vendor', updated)
}

function updateWarehouse(field, value) {
  const updated = { ...localWarehouse, [field]: value }
  emit('update:warehouse', updated)
}
</script>
