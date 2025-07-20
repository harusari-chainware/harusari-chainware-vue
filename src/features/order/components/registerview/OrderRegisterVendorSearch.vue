<template>
  <RegisterRightPanel>
    <div class="search-box">
      <p>거래처 검색 결과</p>
      <ul>
        <li v-for="vendor in vendorList" :key="vendor.id" @click="select(vendor)">
          {{ vendor.name }}
        </li>
      </ul>
    </div>
  </RegisterRightPanel>
</template>

<script setup>
// console.log("search 창 열림")
import RegisterRightPanel from "@/components/layout/registerview/RegisterRightPanel.vue";

const emit = defineEmits(['select'])

const vendorList = [
  { id: 1, name: '농심식자재', phone: '02-1234-5678' },
  { id: 2, name: '서울식품', phone: '02-9876-5432' },
]

function select(vendor) {
  emit('select', vendor)
}
</script>
