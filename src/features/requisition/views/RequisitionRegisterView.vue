<template>
  <RegisterLayout title="품의 등록" description="품의 내용을 작성하세요.">
    <template #actions>
      <StatusButton type="primary" @click="submit">등록</StatusButton>
      <StatusButton type="reset" @click="cancel">취소</StatusButton>
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
          @select="handleSelect"
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
      <RequisitionRegisterFooter />
    </template>
  </RegisterLayout>
</template>

<script setup>
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import RegisterSummaryBox from '@/components/layout/registerview/RegisterSummaryBox.vue'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createRequisition } from '@/features/requisition/RequisitionApi'
import StatusButton from "@/components/common/StatusButton.vue"
import RequisitionRegisterFooter from "@/features/requisition/components/Register/RequisitionRegisterFooter.vue";
import RequisitionRegisterDetail from "@/features/requisition/components/Register/RequisitionRegisterDetail.vue";
import RequisitionRegisterRightPanel from "@/features/requisition/components/Register/RequisitionRegisterRightPanel.vue";
import RequisitionRegisterLeft from "@/features/requisition/components/Register/RequisitionRegisterLeft.vue";

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
  store: {},  // store.memberId 필요
  orderType: '',
  items: []
})

const showRightPanel = ref(false)
const searchType = ref(null)
const searchKeyword = ref('') // ✅ 검색어 저장용

function openSearch(type, keyword = '') {
  console.log('[openSearch called]', type, keyword)
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
      showRightPanel.value = false
    }
  } else {
    switch (searchType.value) {
      case 'vendor':
        Object.assign(form.vendor, payload)
        break
      case 'approver':
        Object.assign(form.approver, payload)
        break
      case 'warehouse':
        Object.assign(form.warehouse, payload)
        break
    }
    showRightPanel.value = false
  }
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
const totalQuantity = computed(() =>
    form.items.reduce((sum, item) => sum + item.quantity, 0)
)
const totalAmount = computed(() =>
    form.items.reduce((sum, item) => sum + item.contractPrice * item.quantity, 0)
)

function isValid() {
  if (!form.approver?.memberId) return alert('결재자를 선택해주세요.')
  if (!form.vendor?.vendorId) return alert('거래처를 선택해주세요.')
  if (!form.warehouse?.warehouseId) return alert('창고를 선택해주세요.')
  if (!form.deliveryDate) return alert('납기일을 입력해주세요.')
  if (form.items.length === 0) return alert('상품을 한 개 이상 추가해주세요.')
  return true
}

async function submit() {
  // 1. form.approver 확인
  console.log('📌 form.approver:', JSON.stringify(form.approver, null, 2))
  console.log('📌 form.approver.memberId:', form.approver?.memberId)
  console.log('📌 form.approver.id:', form.approver?.id)

  // 2. 전체 form 객체 확인
  console.log('📌 전체 form:', JSON.parse(JSON.stringify(form)))

  // 3. 유효성 검사
  if (!isValid()) return

  // 4. 최종 payload 구성
  const payload = {
    vendorId: form.vendor?.vendorId,
    approvedMemberId: form.approver?.memberId, // 또는 .id → 로그 보고 수정
    warehouseId: form.warehouse?.warehouseId,
    dueDate: form.deliveryDate,
    items: form.items.map(item => ({
      contractId: item.contractId,
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.contractPrice
    }))
  }

  // 5. 전송 전 로그
  console.log('🚀 최종 payload:', JSON.stringify(payload, null, 2))

  try {
    await createRequisition(payload)
    alert('품의서가 성공적으로 등록되었습니다.')
    resetForm()
    router.push('/requisitions/list')
  } catch (error) {
    alert('등록 중 오류가 발생했습니다.')
    console.error('❌ 등록 오류:', error)
  }
}

function cancel() {
  if (confirm('입력한 내용을 모두 초기화하시겠습니까?')) {
    resetForm()
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
