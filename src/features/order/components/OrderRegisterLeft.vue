<template>
  <div class="left-section">
    <OrderRegisterStoreInfo :store="store" />
    <RegisterInfoGroup title="납기일">
      <DatePickerField
          label="납기일"
          :model-value="deliveryDate"
          @update:model-value="val => emit('update:deliveryDate', val)"
      />
    </RegisterInfoGroup>
  </div>
</template>

<script setup>
import OrderRegisterStoreInfo from './registerview/OrderRegisterStoreInfo.vue'
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import DatePickerField from '@/components/common/fields/DatePickerField.vue'

const props = defineProps({
  store: Object,
  deliveryDate: String
})

const emit = defineEmits(['update:deliveryDate'])
</script>
