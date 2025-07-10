<!-- components/common/VendorSearchModal.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'select'])

const searchKeyword = ref('')
const vendorList = ref([])

watch(() => props.visible, (val) => {
  if (val) {
    searchVendors()
  }
})

const close = () => emit('update:visible', false)

const searchVendors = async () => {
  // 임시 mock (실제 API 연결 필요)
  vendorList.value = [
    { id: 1, name: '커피공급사' },
    { id: 2, name: '물류센터A' }
  ].filter(v => v.name.includes(searchKeyword.value))
}

const handleSelect = (vendor) => {
  emit('select', vendor)
  close()
}
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h2>거래처 검색</h2>
      <input v-model="searchKeyword" @input="searchVendors" placeholder="거래처명 검색" />
      <ul>
        <li v-for="vendor in vendorList" :key="vendor.id" @click="handleSelect(vendor)">
          {{ vendor.name }}
        </li>
      </ul>
      <button @click="close">닫기</button>
    </div>
  </div>
</template>
