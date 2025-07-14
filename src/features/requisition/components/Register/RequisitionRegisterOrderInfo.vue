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

      <AutoCompleteField
          label="창고명"
          v-model="warehouseKeyword"
          :fetchFn="fetchWarehouses"
          @select="(w) => emit('update:warehouse', w)"
      />

    </div>
  </RegisterInfoGroup>
</template>

<script setup>
import { ref } from 'vue'
import RegisterInfoGroup from '@/components/layout/registerview/RegisterInfoGroup.vue'
import SearchFieldWithButton from '@/components/common/fields/SearchFieldWithButton.vue'
import { fetchVendors } from '@/features/vendor/api.js'
import {fetchWarehouses} from "@/features/warehouse/api.js";
import AutoCompleteField from "@/features/requisition/components/Register/AutoCompleteField.vue";

const props = defineProps({
  vendor: Object,
  warehouse: Object,
  deliveryDate: String,
  orderCategory: String,
  address: String,
})

const emit = defineEmits([
  'update:vendor',
  'update:warehouse',
  'update:deliveryDate',
  'update:orderCategory',
  'update:address',
])

const vendorKeyword = ref('')
const warehouseKeyword = ref('')

async function handleSearchVendor() {
  if (!vendorKeyword.value) {
    alert('검색어를 입력해주세요.')
    return
  }

  try {
    const res = await fetchVendors({ vendorName: vendorKeyword.value })
    console.log('📦 거래처 검색 결과:', res)

    const list = res.data?.data?.contents || []
    if (list.length > 0) {
      emit('update:vendor', list[0]) // ✅ 상위에서 바인딩된 form.vendor에 직접 반영
    } else {
      alert('검색된 거래처가 없습니다.')
    }
  } catch (e) {
    console.error('❌ 거래처 검색 실패:', e)
    alert('거래처 검색 중 오류가 발생했습니다.')
  }
}

function handleSearchWarehouse() {
  emit('searchWarehouse', warehouseKeyword.value)
}

const orderCategoryOptions = [
  { label: '공급업체', value: '공급업체' },
  { label: '물류', value: '물류' },
  { label: '기타', value: '기타' },
]
</script>
