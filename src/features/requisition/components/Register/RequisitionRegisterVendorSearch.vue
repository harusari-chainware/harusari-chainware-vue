<template>
  <Modal :model-value="modelValue" @close="emit('close')">
    <template #title>거래처 검색</template>
    <template #body>
      <div class="p-4">
        <div class="flex gap-2 mb-4">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="거래처명을 입력하세요"
              class="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <button
              @click="handleSearch"
              class="bg-primary text-white px-4 py-2 rounded"
          >
            검색
          </button>
        </div>

        <div v-if="vendors.length === 0" class="text-gray-500 text-sm">
          검색 결과가 없습니다.
        </div>

        <ul class="divide-y border rounded">
          <li
              v-for="vendor in vendors"
              :key="vendor.vendorId"
              class="p-4 flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <div class="font-semibold">{{ vendor.vendorName }}</div>
              <div class="text-sm text-gray-500">{{ vendor.vendorAddress.addressRoad }}</div>
            </div>
            <button
                class="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                @click="selectVendor(vendor)"
            >
              선택
            </button>
          </li>
        </ul>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import {fetchVendors } from "@/features/vendor/api.js";
import Modal from "@/components/common/Modal.vue";

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['close', 'select'])

const searchQuery = ref('')
const vendors = ref([])

const handleSearch = async () => {
  try {
    const { data } = await fetchVendors({ vendorName: searchQuery.value })
    vendors.value = data.data.contents
  } catch (error) {
    console.error('거래처 검색 실패:', error)
    vendors.value = []
  }
}

const selectVendor = (vendor) => {
  emit('select', vendor)
  emit('close')
}
</script>
