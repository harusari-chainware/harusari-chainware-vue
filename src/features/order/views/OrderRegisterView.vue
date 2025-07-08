<template>
  <RegisterLayout title="주문 등록" description="납기일을 지정하고 각 제품에 대해 주문하세요.">
    <template #actions>
      <!-- 상단에 액션 버튼이 필요하다면 여기 정의-->
<!--      <StatusButton type="primary" @click="submit">등록</StatusButton>-->
<!--      <StatusButton type="reset" @click="cancel">취소</StatusButton>-->
    </template>

    <template #left>
      <OrderRegisterLeft
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
          @searchVendor="() => openSearch('vendor')"
          @searchApprover="() => openSearch('approver')"
          @searchWarehouse="() => openSearch('warehouse')"
      />
    </template>

    <template #right v-if="showRightPanel">
      <OrderRegisterRightPanel
          :type="searchType"
          :multi="searchType === 'vendor' || searchType === 'product'"
          @select="handleSelect"
          @close="showRightPanel = false"
      />
    </template>

    <template #detail>
      <OrderRegisterDetail
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
      <OrderRegisterFooter />
    </template>
  </RegisterLayout>
</template>

<script setup>
import RegisterLayout from '@/components/layout/RegisterLayout.vue'
import RegisterSummaryBox from '@/components/layout/registerview/RegisterSummaryBox.vue'
import OrderRegisterLeft from '../components/OrderRegisterLeft.vue'
import OrderRegisterRightPanel from '../components/OrderRegisterRightPanel.vue'
import OrderRegisterDetail from '../components/OrderRegisterDetail.vue'
import OrderRegisterFooter from '../components/OrderRegisterFooter.vue'
import { dummyOrderRegister } from '@/constants/dummy/orderRegister'
import { computed, reactive, ref } from 'vue'
import StatusButton from "@/components/common/StatusButton.vue"

const form = reactive({
  ...dummyOrderRegister,
  items: []
})

const showRightPanel = ref(false)
const searchType = ref(null)

function openSearch(type) {
  searchType.value = type
  showRightPanel.value = true
}

function handleSelect(payload) {
  if (Array.isArray(payload)) {
    if (searchType.value === 'product') {
      // 중복 제거 + 기존 항목 유지
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
    form.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
)

function submit() {
  alert('제출됨: ' + JSON.stringify(form))
}

function cancel() {
  alert('취소됨')
}
</script>
