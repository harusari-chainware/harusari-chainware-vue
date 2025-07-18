<template>
  <div class="left-section">
    <RequisitionRegisterDrafterInfo :drafter="drafter" />

    <RequisitionRegisterApproverInfo
        :approver="approver"
        @update:approver="val => emit('update:approver', val)"
        @searchApprover="openApproverSearch"
    />

    <RequisitionRegisterOrderInfo
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


    <RequisitionRegisterApproverModal
        :visible="isApproverModalVisible"
        @update:visible="val => isApproverModalVisible = val"
        @select="handleApproverSelect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMembers } from '@/features/member/api.js'
import RequisitionRegisterOrderInfo from '@/features/requisition/components/Register/RequisitionRegisterOrderInfo.vue'
import RequisitionRegisterApproverInfo from '@/features/requisition/components/Register/RequisitionRegisterApproverInfo.vue'
import RequisitionRegisterDrafterInfo from '@/features/requisition/components/Register/RequisitionRegisterDrafterInfo.vue'
import { useAuthStore } from '@/features/auth/useAuthStore.js'
import RequisitionRegisterApproverModal from "@/features/requisition/components/Register/RequisitionRegisterApproverModal.vue";

const props = defineProps({
  orderType: String,
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

const drafter = ref({})
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const email = authStore.email
    const { data } = await getMembers({ email })
    const result = data?.data?.contents?.[0]
    if (result) {
      drafter.value = {
        memberId: result.memberId,
        name: result.name,
        email: result.email,
        phoneNumber: result.phoneNumber,
        position: result.position
      }
    }
  } catch (error) {
    console.error('[기안자 정보 조회 실패]', error)
  }
})


function openVendorSearch() {
  const keyword = props.vendor?.vendorId || ''
  emit('searchVendor', keyword) // keyword 포함 emit
}

function openWarehouseSearch() {
  const keyword = props.warehouse?.warehouseName || ''
  emit('searchWarehouse', keyword)
}

const isApproverModalVisible = ref(false)

function openApproverSearch() {
  isApproverModalVisible.value = true
}

function handleApproverSelect(member) {
  emit('update:approver', {
    memberId: member.memberId,
    name: member.name,
    email: member.email,
    phoneNumber: member.phoneNumber,
    position: member.position
  })
  isApproverModalVisible.value = false
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
