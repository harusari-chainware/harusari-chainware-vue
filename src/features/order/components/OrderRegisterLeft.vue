<template>
  <div class="left-section">
    <OrderRegisterStoreInfo :store="store" />
    <OrderRegisterApproverInfo
        :approver="approver"
        @update:approver="val => emit('update:approver', val)"
        @searchApprover="openApproverSearch"
    />
    <OrderRegisterOrderInfo
        :vendor="vendor"
        :warehouse="warehouse"
        :deliveryDate="deliveryDate"
        :orderCategory="orderCategory"
        :memo="memo"
        :address="address"
        :attachments="attachments"
        @update:vendor="val => emit('update:vendor', val)"
        @update:warehouse="val => emit('update:warehouse', val)"
        @update:deliveryDate="val => emit('update:deliveryDate', val)"
        @update:orderCategory="val => emit('update:orderCategory', val)"
        @update:memo="val => emit('update:memo', val)"
        @update:address="val => emit('update:address', val)"
        @update:attachments="val => emit('update:attachments', val)"
        @searchVendor="openVendorSearch"
        @searchWarehouse="openWarehouseSearch"
    />
  </div>
</template>

<script setup>
import OrderRegisterStoreInfo from './OrderRegisterStoreInfo.vue'
import OrderRegisterApproverInfo from './OrderRegisterApproverInfo.vue'
import OrderRegisterOrderInfo from './OrderRegisterOrderInfo.vue'

const props = defineProps({
  orderType: String,
  store: Object,
  approver: Object,
  vendor: Object,
  warehouse: Object,
  deliveryDate: String,
  orderCategory: String,
  memo: String,
  address: String,
  attachments: Array
})

const emit = defineEmits([
  'update:approver',
  'update:vendor',
  'update:warehouse',
  'update:deliveryDate',
  'update:orderCategory',
  'update:memo',
  'update:address',
  'update:attachments',
  'searchApprover',
  'searchVendor',
  'searchWarehouse'
])

function openApproverSearch() {
  emit('searchApprover')
}
function openVendorSearch() {
  console.log('[Left] 거래처 검색 emit 됨')
  emit('searchVendor')
}

function openWarehouseSearch() {
  emit('searchWarehouse')
}
</script>

<style scoped>
.left-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: var(--font-page-title-large);
  color: var(--color-primary);
  border-left: 4px solid var(--color-primary);
  padding-left: 0.75rem;
}
</style>
