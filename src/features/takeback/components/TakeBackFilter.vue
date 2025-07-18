<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'
import { fetchAllFranchises, fetchAllWarehouses } from '@/features/takeback/api.js'

const emit = defineEmits(['search'])

const filters = ref({
  warehouseName: '',
  franchiseName: '',
  takeBackStatus: '',
  fromDate: '',
  toDate: ''
})

const dateRange = ref({ start: '', end: '' })
watch(dateRange, (val) => {
  filters.value.fromDate = val.start
  filters.value.toDate = val.end
})

/** ✅ 가맹점 자동완성 **/
const allFranchises = ref([])
const franchiseKeyword = ref('')
const filteredFranchises = ref([])
const isFranchiseDropdownVisible = ref(false)
const franchiseBoxRef = ref(null)

const loadFranchises = async () => {
  const res = await fetchAllFranchises()
  allFranchises.value = res?.data?.data ?? res ?? []
  filteredFranchises.value = allFranchises.value
}

const filterFranchiseList = () => {
  const keyword = franchiseKeyword.value.trim().toLowerCase()
  if (keyword === '') {
    filteredFranchises.value = allFranchises.value
  } else {
    filteredFranchises.value = allFranchises.value.filter(f =>
        f.name.toLowerCase().includes(keyword)
    )
  }
  isFranchiseDropdownVisible.value = true
}

const selectFranchise = (name) => {
  filters.value.franchiseName = name
  franchiseKeyword.value = name
  isFranchiseDropdownVisible.value = false
}

/** ✅ 창고 자동완성 **/
const allWarehouses = ref([])
const warehouseKeyword = ref('')
const filteredWarehouses = ref([])
const isWarehouseDropdownVisible = ref(false)
const warehouseBoxRef = ref(null)

const loadWarehouses = async () => {
  const res = await fetchAllWarehouses()
  allWarehouses.value = res?.data?.data ?? res ?? []
  filteredWarehouses.value = allWarehouses.value
}

const filterWarehouseList = () => {
  const keyword = warehouseKeyword.value.trim().toLowerCase()
  if (keyword === '') {
    filteredWarehouses.value = allWarehouses.value
  } else {
    filteredWarehouses.value = allWarehouses.value.filter(w =>
        w.name.toLowerCase().includes(keyword)
    )
  }
  isWarehouseDropdownVisible.value = true
}

const selectWarehouse = (name) => {
  filters.value.warehouseName = name
  warehouseKeyword.value = name
  isWarehouseDropdownVisible.value = false
}

/** ✅ 클릭 외부 감지 **/
const handleClickOutside = (e) => {
  if (franchiseBoxRef.value && !franchiseBoxRef.value.contains(e.target)) {
    isFranchiseDropdownVisible.value = false
  }
  if (warehouseBoxRef.value && !warehouseBoxRef.value.contains(e.target)) {
    isWarehouseDropdownVisible.value = false
  }
}

/** ✅ 기본 로딩 **/
onMounted(() => {
  loadFranchises()
  loadWarehouses()
  onSearch()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const onSearch = () => {
  emit('search', { ...filters.value })
}

const onReset = () => {
  filters.value = {
    warehouseName: '',
    franchiseName: '',
    takeBackStatus: '',
    fromDate: '',
    toDate: ''
  }
  warehouseKeyword.value = ''
  franchiseKeyword.value = ''
  filteredWarehouses.value = allWarehouses.value
  filteredFranchises.value = allFranchises.value
  isWarehouseDropdownVisible.value = false
  isFranchiseDropdownVisible.value = false
  dateRange.value = { start: '', end: '' }
  emit('search', { ...filters.value })
}
</script>

<template>
  <div class="filter-card">
    <form class="filter-grid" @submit.prevent="onSearch">
      <!-- ✅ 창고명 -->
      <div class="form-group" ref="warehouseBoxRef">
        <label>창고명</label>
        <input
            v-model="warehouseKeyword"
            class="form-control"
            placeholder="창고명 입력"
            @input="filterWarehouseList"
            @focus="filterWarehouseList"
        />
        <ul v-if="isWarehouseDropdownVisible && filteredWarehouses.length > 0" class="suggestion-box">
          <li
              v-for="item in filteredWarehouses"
              :key="item.id"
              @mousedown.prevent="selectWarehouse(item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <!-- ✅ 가맹점명 -->
      <div class="form-group" ref="franchiseBoxRef">
        <label>가맹점명</label>
        <input
            v-model="franchiseKeyword"
            class="form-control"
            placeholder="가맹점명 입력"
            @input="filterFranchiseList"
            @focus="filterFranchiseList"
        />
        <ul v-if="isFranchiseDropdownVisible && filteredFranchises.length > 0" class="suggestion-box">
          <li
              v-for="item in filteredFranchises"
              :key="item.id"
              @mousedown.prevent="selectFranchise(item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="form-group">
        <label>상태</label>
        <select v-model="filters.takeBackStatus" class="form-control">
          <option value="">전체 상태</option>
          <option value="REQUESTED">요청됨</option>
          <option value="COLLECTED">수거됨</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">반려됨</option>
          <option value="CANCELED">취소됨</option>
        </select>
      </div>

      <div class="form-group">
        <FilterDateRange label="신청일 범위" v-model="dateRange" />
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="onReset">초기화</button>
        <button type="submit" class="btn btn-primary">조회</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* 기존 스타일 동일 */
.filter-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem 1.5rem;
  align-items: end;
}
.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}
.form-group label {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #374151;
}
.form-control {
  height: 38px;
  padding: 0 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
.suggestion-box {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #d1d5db;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 0 0 0.375rem 0.375rem;
  margin-top: 2px;
}
.suggestion-box li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.875rem;
}
.suggestion-box li:hover {
  background-color: #f3f4f6;
}
.form-actions {
  grid-column: span 4;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background-color: rgb(58, 174, 216);
  color: white;
}
.btn-primary:hover {
  background-color: #2c91bc;
}
.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}
.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
