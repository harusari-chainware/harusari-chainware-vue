<!--
<template>
  <RegisterRightPanel :title="panelTitle">
    <GenericSearchWrapper
        :type="props.type"
        v-model:search="searchText"
        :results="searchResults"
        @select="(item) => emit('select', item)"
    />
  </RegisterRightPanel>
</template>

<script setup>
import { ref, watch } from 'vue'
import { fetchVendors } from '@/features/vendor/api.js'
import { fetchWarehouses } from '@/features/warehouse/api.js'
import { getContractProductsByVendor } from '@/features/contract/contractApi.js'
import GenericSearchWrapper from "@/components/common/GenericSearchWrapper.vue";
import RegisterRightPanel from "@/components/layout/registerview/RegisterRightPanel.vue";

const props = defineProps({ type: String, multi: Boolean })
const emit = defineEmits(['select', 'close'])

const searchText = ref('')
const searchResults = ref([])

watch(searchText, async (val) => {
  if (!val) return

  if (props.type === 'vendor') {
    const { data } = await fetchVendors({ vendorName: val })
    searchResults.value = data.contents
  } else if (props.type === 'warehouse') {
    const { data } = await fetchWarehouses({ warehouseName: val })
    searchResults.value = data.contents
  } else if (props.type === 'product') {
    const { data } = await getContractProductsByVendor({ vendorName: val })
    searchResults.value = data.content
  }
})
</script>
-->
<template>
  <RegisterRightPanel :title="panelTitle" @close="emit('close')">
    <GenericSearchWrapper
        :type="props.type"
        v-model:search="searchText"
        :results="searchResults"
        :multi="props.multi"
        @select="handleSelect"
    />
  </RegisterRightPanel>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { fetchVendors } from '@/features/vendor/api.js'
import { fetchWarehouses } from '@/features/warehouse/api.js'
import { getContractProductsByVendor } from '@/features/contract/contractApi.js'
import GenericSearchWrapper from '@/components/common/GenericSearchWrapper.vue'
import RegisterRightPanel from '@/components/layout/registerview/RegisterRightPanel.vue'

const props = defineProps({
  type: { type: String, required: true },
  keyword: { type: String, default: '' },
  multi: Boolean
})
const emit = defineEmits(['select', 'close'])

const searchText = ref(props.keyword || ' ')  // ✅ 공백 넣어서 watch 트리거 유도
const searchResults = ref([])

const panelTitle = computed(() => {
  switch (props.type) {
    case 'vendor':
      return '거래처 검색'
    case 'warehouse':
      return '창고 검색'
    case 'product':
      return '계약 상품 검색'
    default:
      return '검색'
  }
})

// ✅ props.keyword가 바뀌면 searchText 반영
watch(() => props.keyword, (val) => {
  searchText.value = val || ' '  // 기본 검색어
})

// ✅ mounted 시점에 검색 실행
onMounted(() => {
  if (!searchText.value) {
    searchText.value = ' '  // 최소 공백 트리거
  }
  searchNow(searchText.value)
})

// ✅ 별도 메서드로 검색 수행
async function searchNow(val) {
  if (!val) return

  try {
    if (props.type === 'vendor') {
      const { data } = await fetchVendors({ vendorName: val })
      searchResults.value = data.contents || []
    } else if (props.type === 'warehouse') {
      const { data } = await fetchWarehouses({ warehouseName: val })
      searchResults.value = data.contents || []
    } else if (props.type === 'product') {
      const vendor = JSON.parse(sessionStorage.getItem('selectedVendor') || '{}')
      if (!vendor.id) {
        searchResults.value = []
        return
      }
      const { data } = await getContractProductsByVendor({
        vendorId: vendor.id,
        productName: val
      })
      searchResults.value = data.content || []
    }
  } catch (e) {
    console.error('검색 실패:', e)
    searchResults.value = []
  }
}

// ✅ 검색어 변경 시 API 호출
watch(searchText, (val) => {
  searchNow(val)
})

// ✅ 항목 선택 시 emit
function handleSelect(item) {
  if (props.type === 'vendor') {
    sessionStorage.setItem('selectedVendor', JSON.stringify(item))
  }
  emit('select', item)
}
</script>
