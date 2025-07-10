<!-- components/common/WarehouseSearchModal.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'select'])

const searchKeyword = ref('')
const warehouseList = ref([])

watch(() => props.visible, (val) => {
  if (val) {
    searchWarehouses()
  }
})

const close = () => emit('update:visible', false)

const searchWarehouses = async () => {
  // 임시 mock (실제 API 연결 필요)
  warehouseList.value = [
    { id: 1, name: '서울 물류창고' },
    { id: 2, name: '부산 창고' }
  ].filter(w => w.name.includes(searchKeyword.value))
}

const handleSelect = (warehouse) => {
  emit('select', warehouse)
  close()
}
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h2>창고 검색</h2>
      <input v-model="searchKeyword" @input="searchWarehouses" placeholder="창고명 검색" />
      <ul>
        <li v-for="warehouse in warehouseList" :key="warehouse.id" @click="handleSelect(warehouse)">
          {{ warehouse.name }}
        </li>
      </ul>
      <button @click="close">닫기</button>
    </div>
  </div>
</template>
