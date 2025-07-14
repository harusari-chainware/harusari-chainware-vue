<script setup>
import { ref, watch } from 'vue'
import { fetchVendors } from '@/features/vendor/api.js'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible', 'select'])

const searchKeyword = ref('')
const vendorList = ref([])

watch(() => props.visible, (val) => {
  if (val) {
    searchKeyword.value = ''
    vendorList.value = []
    searchVendors()
  }
})

const close = () => emit('update:visible', false)

const searchVendors = async () => {
  try {
    const response = await fetchVendors({ vendorName: searchKeyword.value })
    const contents = response?.data?.data?.contents
    vendorList.value = Array.isArray(contents) ? contents : []
  } catch (e) {
    console.error('거래처 검색 실패', e)
    vendorList.value = []
  }
}

const handleSelect = (vendor) => {
  emit('select', vendor)
  close()
}
</script>

<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <h2>거래처 검색</h2>
        <button class="close-button" @click="close">×</button>
      </div>

      <div class="modal-body">
        <input
            v-model="searchKeyword"
            @input="searchVendors"
            placeholder="거래처명을 입력하세요"
            class="search-input"
        />

        <ul v-if="vendorList.length > 0" class="vendor-list">
          <li
              v-for="vendor in vendorList"
              :key="vendor.vendorId"
              @click="handleSelect(vendor)"
          >
            <div class="vendor-name">{{ vendor.vendorName }}</div>
            <div class="vendor-sub">
              {{ vendor.vendorMangerName }} · {{ vendor.phoneNumber }}
            </div>
          </li>
        </ul>

        <div v-else class="empty-message">검색 결과가 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 배경 오버레이 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* 모달 본체 */
.modal-box {
  background: #fff;
  border-radius: 12px;
  width: 520px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e3e7ec;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0;
  color: #1f2d3d;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #1f2d3d;
  cursor: pointer;
}

/* 본문 */
.modal-body {
  padding: 1.25rem 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccd5df;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: #1f2d3d;
}

/* 리스트 */
.vendor-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 260px;
  overflow-y: auto;
}

.vendor-list li {
  border: 1px solid #e3e7ec;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fafbfd;
}

.vendor-list li:hover {
  background-color: #e9f4fb;
  border-color: #3aaed8;
}

/* 텍스트 구성 */
.vendor-name {
  font-size: 1rem;
  font-weight: 600;
  color: #3aaed8;
}

.vendor-sub {
  margin-top: 4px;
  font-size: 0.875rem;
  color: #6c7a89;
}

/* 결과 없음 */
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.95rem;
}
</style>
