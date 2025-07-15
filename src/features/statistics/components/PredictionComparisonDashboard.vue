<script setup>
import {ref, onMounted, computed, nextTick} from 'vue'
import { fetchPredictionComparison, fetchAllFranchises } from '../api.js'
import Chart from 'chart.js/auto'

const predictionType = ref('sales')
const franchiseId = ref('')
const chartInstance = ref(null)
const chartData = ref([])
const franchiseList = ref([])
const searchKeyword = ref('')
const shouldRenderChart = ref(true)


// "발주 수량"일 때는 본사 고정 + 입력 막기
const isHeadquartersOnly = computed(() => predictionType.value === 'purchase_quantity')

const filteredFranchiseList = computed(() => {
  if (!searchKeyword.value.trim()) return franchiseList.value
  return franchiseList.value.filter(f => f.name.includes(searchKeyword.value.trim()))
})

function typeButtonClass(type) {
  return `filter-button${predictionType.value === type ? ' active' : ''}`
}

function setPredictionType(type) {
  predictionType.value = type

  // 발주 수량은 본사 고정, 가맹점 선택 불가
  if (type === 'purchase_quantity') {
    franchiseId.value = ''
    searchKeyword.value = ''
  }

  loadData()
}

async function loadData() {
  const data = await fetchPredictionComparison(predictionType.value, franchiseId.value)
  chartData.value = data
  await updateChart(data)
}

async function updateChart(data) {
  shouldRenderChart.value = false
  await nextTick()

  shouldRenderChart.value = true
  await nextTick()

  const canvas = document.getElementById('predictionChart')
  if (!canvas) {
    console.warn('⚠️ canvas not found')
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.warn('⚠️ context not available')
    return
  }

  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  data.sort((a, b) => new Date(a.date) - new Date(b.date))

  const labels = data.map(d => {
    const date = new Date(d.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  const values = data.map(d => d.value)
  const types = data.map(d => d.type)

  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '실적/예측',
        data: values,
        borderColor: ctx => types[ctx.dataIndex] === 'ACTUAL'
            ? 'rgba(59,130,246,1)' : 'rgba(99,102,241,1)',
        backgroundColor: 'rgba(0,0,0,0)',
        segment: {
          borderColor: ctx => {
            const i = ctx.p0DataIndex
            return types[i] === 'ACTUAL'
                ? 'rgba(59,130,246,1)'
                : 'rgba(99,102,241,1)'
          }
        },
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: {
          labels: {
            generateLabels: () => [
              { text: '실적', strokeStyle: 'rgba(59,130,246,1)', fillStyle: 'rgba(59,130,246,1)', lineWidth: 2 },
              { text: '예측', strokeStyle: 'rgba(99,102,241,1)', fillStyle: 'rgba(99,102,241,1)', lineWidth: 2 }
            ]
          }
        }
      }
    }
  })
}

onMounted(async () => {
  franchiseList.value = await fetchAllFranchises()
  await loadData()
})
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="filter-box">
      <div class="filter-grid">
        <!-- 예측 유형 -->
        <div class="filter-item predict-type">
          <label class="filter-label">예측 유형</label>
          <div class="button-group">
            <button :class="typeButtonClass('sales')" @click="setPredictionType('sales')">매출</button>
            <button :class="typeButtonClass('order_quantity')" @click="setPredictionType('order_quantity')">주문 수량</button>
            <button :class="typeButtonClass('purchase_quantity')" @click="setPredictionType('purchase_quantity')">발주 수량</button>
          </div>
        </div>

        <!-- 가맹점 선택 -->
        <div class="filter-item franchise">
          <label class="filter-label">가맹점</label>
          <select v-model="franchiseId" class="form-control" :disabled="isHeadquartersOnly">
            <option value="">전체 가맹점</option>
            <option v-for="item in filteredFranchiseList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- 가맹점 검색 -->
        <div class="filter-item franchise">
          <label class="filter-label">가맹점 검색</label>
          <input
              v-model="searchKeyword"
              class="form-control"
              placeholder="이름으로 검색"
              :disabled="isHeadquartersOnly"
          />
        </div>

        <!-- 조회 버튼 -->
        <div class="filter-item button">
          <label class="filter-label invisible">조회</label>
          <button class="filter-button active full-width" @click="loadData">조회</button>
        </div>
      </div>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-card">
      <div class="chart-header">
        <span>실적 vs 예측 비교</span>
        <div class="legend">
          <span class="legend-dot blue"></span><span>실적</span>
          <span class="legend-dot indigo"></span><span>예측</span>
          <span class="legend-dot gray"></span><span>오늘</span>
        </div>
      </div>
      <canvas v-if="shouldRenderChart" id="predictionChart" class="chart-canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 2rem;
  background-color: #f9fafb;
  font-family: 'Noto Sans KR', sans-serif;
}

.dashboard-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.filter-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filter-grid {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

/* 고정 너비로 정렬 */
.filter-item.predict-type {
  width: 300px; /* ✅ 버튼 3개를 감싸기 충분한 너비 */
}

.filter-item.franchise {
  width: 280px;
}

.filter-item.button {
  width: 180px;
}
.filter-item.predict-type {
  width: 260px;
}

.filter-item.franchise {
  width: 340px;
}

.filter-item.button {
  width: 180px;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.invisible {
  visibility: hidden;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  min-width: 80px;
  transition: background-color 0.2s;
}

.filter-button:hover {
  background-color:  rgb(58, 174, 216);
}

.filter-button.active {
  background-color:  rgb(58, 174, 216);
  color: white;
}

.button-group button.active {
  background-color:  rgb(58, 174, 216);
  color: white;
}

.filter-button:hover {
  background-color:  rgb(58, 174, 216);
}

.filter-button.active {
  background-color:  rgb(58, 174, 216);
  color: white;
}

.form-control {
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: white;
}

.full-width {
  width: 100%;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 500;
}

.legend {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 4px;
}

.blue {
  background-color: #3b82f6;
}

.indigo {
  background-color: #6366f1;
}

.gray {
  background-color: #d1d5db;
}
.filter-button {
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  min-width: 80px;
}

.filter-button.active {
  background-color:  rgb(58, 174, 216);
  color: white;
}
.chart-canvas {
  width: 100% !important;
  height: 300px !important;
  display: block;
}
</style>