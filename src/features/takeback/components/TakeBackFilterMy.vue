<script setup>
import { ref, watch } from 'vue'
import FilterDateRange from '@/components/common/filters/FilterDateRange.vue'

const emit = defineEmits(['search'])

const filters = ref({
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

const onSearch = () => {
  emit('search', { ...filters.value })
}

const onReset = () => {
  filters.value = {
    franchiseName: '',
    takeBackStatus: '',
    fromDate: '',
    toDate: ''
  }
  dateRange.value = { start: '', end: '' }
  emit('search', { ...filters.value })
}
</script>

<template>
  <div class="filter-card">
    <form class="filter-grid" @submit.prevent="onSearch">
      <!-- 가맹점명 -->
      <div class="form-group">
        <label>가맹점명</label>
        <input v-model="filters.franchiseName" class="form-control" placeholder="가맹점명 입력" />
      </div>

      <!-- 상태 -->
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

      <!-- 신청일 범위 -->
      <div class="form-group">
        <FilterDateRange label="신청일 범위" v-model="dateRange" />
      </div>

      <!-- 버튼 -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="onReset">초기화</button>
        <button type="submit" class="btn btn-primary">조회</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-self: end;
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
