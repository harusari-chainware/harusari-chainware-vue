<script setup>
import { ref, onMounted } from 'vue'
// ✅ 실제 API 사용 시 아래 주석 해제
// import { fetchPredictionComparison } from '../statistics/api.js'
import Chart from 'chart.js/auto'

const predictionType = ref('sales')
const franchiseId = ref('')
const chartInstance = ref(null)

function typeButtonClass(type) {
  return `filter-button${predictionType.value === type ? ' active' : ''}`
}

function setPredictionType(type) {
  predictionType.value = type
  loadData()
}

async function loadData() {
  // ✅ 실제 API 연동 시 아래 더미 삭제하고 fetchPredictionComparison 사용
  // const data = await fetchPredictionComparison(predictionType.value, franchiseId.value)
  const data = getDummyData(predictionType.value) // 🔧 더미 데이터 (CORS 해결 전용)
  updateChart(data)
}

function updateChart(data) {
  if (!data || !data.length) return

  const labels = data.map(d => `${new Date(d.date).getMonth() + 1}/${new Date(d.date).getDate()}`)
  const actual = data.map(d => d.actualValue)
  const predicted = data.map(d => d.predictedValue)

  if (chartInstance.value) chartInstance.value.destroy()

  const ctx = document.getElementById('predictionChart').getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '실적',
          data: actual,
          borderColor: 'rgba(59,130,246,1)',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.3
        },
        {
          label: '예측',
          data: predicted,
          borderColor: 'rgba(79,70,229,1)',
          backgroundColor: 'rgba(79,70,229,0.2)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// 🔧 CORS 해결 전용 더미 데이터 생성 함수 (삭제 예정)
function getDummyData(type) {
  const today = new Date()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - 6 + i)
    return d.toISOString().split('T')[0]
  })

  return dates.map((date, i) => {
    const base = type === 'sales' ? 5000000 : 500
    const fluct = type === 'sales' ? 500000 : 50
    return {
      date,
      actualValue: base + (Math.random() * fluct >> 0),
      predictedValue: base + (Math.random() * fluct >> 0)
    }
  })
}

onMounted(loadData)
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 필터 영역 -->
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

        <div class="filter-item franchise">
          <label class="filter-label">가맹점</label>
          <select v-model="franchiseId" class="form-control">
            <option value="">본사 전체</option>
            <option value="1">가맹점 #1</option>
            <option value="2">가맹점 #2</option>
          </select>
        </div>

        <div class="filter-item button">
          <label class="filter-label invisible">조회</label>
          <button class="filter-button active full-width" @click="loadData">조회</button>
        </div>
      </div>
    </div>

    <!-- 차트 -->
    <div class="chart-card">
      <div class="chart-header">
        <span>실적 vs 예측 비교</span>
        <div class="legend">
          <span class="legend-dot blue"></span><span>실적</span>
          <span class="legend-dot indigo"></span><span>예측</span>
          <span class="legend-dot gray"></span><span>오늘</span>
        </div>
      </div>
      <canvas id="predictionChart" class="chart-canvas"></canvas>
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