<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusButton from "@/components/common/StatusButton.vue"
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import RegisterSummaryBox from '@/components/layout/registerview/RegisterSummaryBox.vue'
import RequisitionRegisterFooter from "@/features/requisition/components/Register/RequisitionRegisterFooter.vue";
import RequisitionRegisterDetail from "@/features/requisition/components/Register/RequisitionRegisterDetail.vue";
import RequisitionRegisterRightPanel from "@/features/requisition/components/Register/RequisitionRegisterRightPanel.vue";
import RequisitionRegisterLeft from "@/features/requisition/components/Register/RequisitionRegisterLeft.vue";
import { createRequisition, updateRequisition } from '@/features/requisition/RequisitionApi'
import { useToast } from 'vue-toastification'

const toast = useToast()


const props = defineProps({
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  requisitionId: [String, Number], // ← 이렇게 수정
  initialData: Object,
})

const router = useRouter()

const form = reactive({
  approver: {},
  vendor: {},
  warehouse: {},
  deliveryDate: '',
  orderCategory: '',
  memo: '',
  address: '',
  attachments: [],
  store: {},
  orderType: '',
  items: []
})

onMounted(() => {
  if (props.mode === 'edit' && props.initialData) {
    Object.assign(form, {
      approver: props.initialData.approver || {},
      vendor: props.initialData.vendor || {},
      warehouse: props.initialData.warehouse || {},
      deliveryDate: props.initialData.deliveryDate || '',
      orderCategory: props.initialData.orderCategory || '',
      memo: props.initialData.memo || '',
      address: props.initialData.address || '',
      attachments: props.initialData.attachments || [],
      store: props.initialData.store || {},
      orderType: props.initialData.orderType || '',
      items: props.initialData.items || []
    })
  }
  openSearch('product')
})

const showRightPanel = ref(false)
const searchType = ref(null)
const searchKeyword = ref('')

function openSearch(type, keyword = '') {
  searchType.value = type
  searchKeyword.value = keyword
  showRightPanel.value = true
}

function handleSelect(payload) {
  if (Array.isArray(payload)) {
    if (searchType.value === 'product') {
      const existingIds = new Set(form.items.map(i => i.id))
      const newItems = payload.filter(p => !existingIds.has(p.id))
      const enriched = newItems.map(p => ({ ...p, quantity: 1 }))
      form.items.push(...enriched)
    }
  } else {
    switch (searchType.value) {
      case 'vendor': Object.assign(form.vendor, payload); break
      case 'approver': Object.assign(form.approver, payload); break
      case 'warehouse': Object.assign(form.warehouse, payload); break
    }
  }
  showRightPanel.value = false
}

function handleSelectProducts(products) {
  const existingIds = new Set(form.items.map(i => i.productId))
  const enriched = products
      .filter(p => !existingIds.has(p.contractId))
      .map(p => ({
        id: p.contractId,
        contractId: p.contractId,
        productId: p.contractId,
        productName: p.productName,
        quantity: p.minOrderQty,
        unitPrice: p.contractPrice,
        totalPrice: p.contractPrice,
        basePrice: p.basePrice,
        contractPrice: p.contractPrice,
        minOrderQty: p.minOrderQty,
        leadTime: p.leadTime
      }))
  form.items.push(...enriched)
}

function handleRemove(itemToRemove) {
  const idx = form.items.findIndex(item => item.id === itemToRemove.id)
  if (idx !== -1) form.items.splice(idx, 1)
}

function handleUpdateItem(index, field, value) {
  form.items[index][field] = value
}

function handleAddProduct() {
  openSearch('product')
}

const totalItems = computed(() => form.items.length)
const totalQuantity = computed(() => form.items.reduce((sum, item) => sum + item.quantity, 0))
const totalAmount = computed(() => form.items.reduce((sum, item) => sum + (item.contractPrice ?? item.unitPrice) * item.quantity, 0))

function isValid() {
  if (!form.approver?.memberId) return toast.error('결재자를 선택해주세요.')
  if (!form.vendor?.vendorId) return toast.error('거래처를 선택해주세요.')
  if (!form.warehouse?.warehouseId) return toast.error('창고를 선택해주세요.')
  if (!form.deliveryDate) return toast.error('납기일을 입력해주세요.')
  if (form.items.length === 0) return toast.error('상품을 한 개 이상 추가해주세요.')
  return true
}

const mode = props.mode
const requisitionId = props.requisitionId


async function submit() {
  if (!isValid()) return

  const payload = {
    vendorId: form.vendor?.vendorId,
    approvedMemberId: form.approver?.memberId,
    warehouseId: form.warehouse?.warehouseId,
    dueDate: form.deliveryDate,
    items: form.items.map(item => ({
      contractId: item.contractId,
      productId: item.productId ?? item.id,
      quantity: item.quantity,
      unitPrice: item.contractPrice ?? item.unitPrice
    }))
  }

  try {
    if (props.mode === 'edit') {
      await updateRequisition(props.requisitionId, payload)
      toast.success('품의서가 성공적으로 수정되었습니다.')
      await router.push({ name: 'RequisitionDetailView', params: { requisitionId: props.requisitionId } })
    } else {
      await createRequisition(payload)
      toast.success('품의서가 성공적으로 등록되었습니다.')
      resetForm()
      await router.push({ name: 'RequisitionListView' })
    }
  } catch (error) {
    toast.error(`${props.mode === 'edit' ? '수정' : '등록'} 중 오류가 발생했습니다.`)
    console.error(error)
  }
}

function cancel() {
  if (confirm('입력한 내용을 모두 초기화하시겠습니까?')) {
    resetForm()
    if (mode === 'edit') {
      router.push({
        name: 'RequisitionDetailView',
        params: { requisitionId: requisitionId }
      })
    } else {
      router.push({ name: 'RequisitionListView' })
    }
  }
}


function resetForm() {
  form.approver = {}
  form.vendor = {}
  form.warehouse = {}
  form.deliveryDate = ''
  form.orderCategory = ''
  form.memo = ''
  form.address = ''
  form.attachments = []
  form.items = []
}
</script>

<template>
  <RegisterLayout
      :title="props.mode === 'edit' ? '품의 수정' : '품의 등록'"
      :description="props.mode === 'edit' ? '품의 내용을 수정하세요.' : '품의 내용을 작성하세요.'"
  >
    <template #actions>
      <StatusButton type="primary" @click="submit">
        {{ props.mode === 'edit' ? '수정 완료' : '등록' }}
      </StatusButton>
      <StatusButton type="reset" @click="cancel">
        {{ props.mode === 'edit' ? '돌아가기' : '취소' }}
      </StatusButton>
    </template>

    <template #left>
      <RequisitionRegisterLeft
          v-model:approver="form.approver"
          v-model:vendor="form.vendor"
          v-model:warehouse="form.warehouse"
          v-model:deliveryDate="form.deliveryDate"
          v-model:orderCategory="form.orderCategory"
          v-model:memo="form.memo"
          v-model:address="form.address"
          v-model:attachments="form.attachments"
          :store="form.store"
          :orderType="form.orderType"
          @searchVendor="(keyword) => openSearch('vendor', keyword)"
          @searchApprover="() => openSearch('approver')"
          @searchWarehouse="(keyword) => openSearch('warehouse', keyword)"
      />
    </template>

    <template #right v-if="showRightPanel">
      <RequisitionRegisterRightPanel
          :type="searchType"
          :keyword="searchKeyword"
          :multi="searchType === 'product'"
          :vendor-id="form.vendor?.vendorId"
          @select="handleSelect"
          @selectProduct="handleSelectProducts"
          @close="showRightPanel = false"
      />
    </template>

    <template #detail>
      <RequisitionRegisterDetail
          :items="form.items"
          @remove="handleRemove"
          @update-item="handleUpdateItem"
          @add-product="handleAddProduct"
      />
    </template>

    <template #summary>
      <RegisterSummaryBox
          :total-items="totalItems"
          :total-quantity="totalQuantity"
          :total-amount="totalAmount"
      />
    </template>

    <template #footer>
      <RequisitionRegisterFooter
          :mode="mode"
          @submit="submit"
          @cancel="cancel"
      />
    </template>
  </RegisterLayout>
</template>
