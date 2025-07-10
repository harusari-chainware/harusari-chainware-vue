<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
// ✅ CORS 허용 후 아래 더미데이터 제거하고 fetchAccuracySummary 사용
// import { fetchAccuracySummary } from '@/features/statistics/api.js'

const franchiseId = ref('')
const periodType = ref('WEEKLY')
const targetDate = ref(new Date(Date.now() - 86400000).toISOString().split('T')[0])
const predictionType = ref('sales')
const chartRef = ref(null)

const labelMap = {
  sales: '매출',
  order: '주문 수량',
  purchase: '발주 수량'
}

const accuracy = ref({
  mape: '5.2%', mapeTrend: '+0.8%',
  mae: '78,500원', maeTrend: '+12,300원',
  rmse: '92,400원', rmseTrend: '+15,600원'
})

function fetchAccuracy() {
  // ✅ CORS 허용 후 아래 더미 데이터 제거하고 API 호출 활성화
  // fetchAccuracySummary(predictionType.value, periodType.value, targetDate.value, franchiseId.value)
  //   .then(data => accuracy.value = data)
  //   .catch(err => console.error('정확도 조회 실패:', err))

  accuracy.value = {
    mape: predictionType.value === 'sales' ? '5.2%' : predictionType.value === 'order' ? '6.8%' : '4.5%',
    mapeTrend: predictionType.value === 'sales' ? '+0.8%' : predictionType.value === 'order' ? '+1.2%' : '-0.3%',
    mae: predictionType.value === 'sales' ? '78,500원' : predictionType.value === 'order' ? '5.2개' : '7.8개',
    maeTrend: predictionType.value === 'sales' ? '+12,300원' : predictionType.value === 'order' ? '-0.8개' : '+1.5개',
    rmse: predictionType.value === 'sales' ? '92,400원' : predictionType.value === 'order' ? '6.7개' : '9.3개',
    rmseTrend: predictionType.value === 'sales' ? '+15,600원' : predictionType.value === 'order' ? '+0.5개' : '-0.7개'
  }

  drawDummyChart()
}

function handleSearch() {
  fetchAccuracy()
}

function drawDummyChart() {
  const ctx = document.getElementById('dummyAccuracyChart')?.getContext('2d')
  if (!ctx) return
  if (chartRef.value) chartRef.value.destroy()

  const labels = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
  const actual = [1200, 1400, 1500, 1700, 2000, 2300, 1800]
  const predicted = [1100, 1350, 1450, 1600, 1900, 2400, 1700]

  chartRef.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '실적',
          data: actual,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '예측',
          data: predicted,
          borderColor: '#6366f1',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: false }
      }
    }
  })
}

function trendColor(trend) {
  return trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
}

onMounted(() => {
  fetchAccuracy()
})
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 필터 영역 -->
    <div class="header-bar">
      <div class="filter-group">
        <select v-model="franchiseId" class="dropdown">
          <option value="">전체 가맹점</option>
          <option value="1">가맹점 A</option>
          <option value="2">가맹점 B</option>
        </select>
        <input type="date" v-model="targetDate" class="date-input" />
        <button class="search-button">조회</button>
      </div>
    </div>

    <!-- 예측 유형 탭 (카드 상단에 위치) -->
    <div class="prediction-tab-bar">
      <button
          :class="{ active: predictionType === 'sales' }"
          @click="predictionType = 'sales'; handleSearch()"
      >매출</button>
      <button
          :class="{ active: predictionType === 'order' }"
          @click="predictionType = 'order'; handleSearch()"
      >주문 수량</button>
      <button
          :class="{ active: predictionType === 'purchase' }"
          @click="predictionType = 'purchase'; handleSearch()"
      >발주 수량</button>
    </div>

    <!-- 차트 + 정확도 카드 -->
    <div class="content-section">
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-header-left">{{ labelMap[predictionType] }} 예측 vs 실적</div>
          <div class="chart-toggle">
            <button :class="{ active: periodType === 'WEEKLY' }" @click="periodType = 'WEEKLY'; handleSearch()">주간</button>
            <button :class="{ active: periodType === 'MONTHLY' }" @click="periodType = 'MONTHLY'; handleSearch()">월간</button>
          </div>
        </div>
        <div class="chart-body">
          <canvas id="dummyAccuracyChart" height="280"></canvas>
        </div>
      </div>

      <div class="accuracy-card">
        <div class="accuracy-header">{{ labelMap[predictionType] }} 예측 정확도</div>
        <div class="accuracy-metric-container">
          <div class="accuracy-metric" v-for="metric in ['mape', 'mae', 'rmse']" :key="metric">
            <div class="metric-row">
              <span class="metric-title">{{ metric.toUpperCase() }}</span>
              <span class="metric-value">{{ accuracy[metric] }}</span>
            </div>
            <p class="metric-diff" :class="trendColor(accuracy[metric + 'Trend'])">
              {{ accuracy[metric + 'Trend'] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 24px;
  font-family: 'Pretendard', sans-serif;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dropdown,
.date-input {
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 6px;
}

.search-button {
  background-color: rgb(58, 174, 216);
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 500;
}

.prediction-tab-bar {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
  background-color: white;
  margin-bottom: 25px;
}

.prediction-tab-bar button {
  font-size: 14px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.prediction-tab-bar button.active {
  color: #4f46e5;
  border-bottom: 2px solid #4f46e5;
  font-weight: 600;
}

.content-section {
  display: flex;
  gap: 24px;
}

.chart-container {
  flex: 0.75;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  height: 410px;
}

.chart-header {
  background-color: #eef0ff;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #4f46e5;
}

.chart-header-left {
  font-size: 15px;
  font-weight: 600;
}

.chart-toggle button {
  margin-left: 0.5rem;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  border-bottom: 2px solid transparent;
}
.chart-toggle button.active {
  color: #6DACD3;
  border-bottom: 2px solid #4f46e5;
}

.chart-body {
  padding: 20px;
}

.accuracy-card {
  flex: 0.25;
  width: 220px;
  height: 410px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.accuracy-header {
  background-color: #eef0ff;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
}

.accuracy-metric-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  justify-content: space-between;
}

.accuracy-metric {
  background-color: #f0f9ff;
  padding: 14px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-title {
  font-size: 25px;
  font-weight: 600;
  color: #4b5563;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.metric-diff {
  font-size: 13px;
  margin-top: 2px;
}

.text-green-500 {
  color: #10b981;
}

.text-red-500 {
  color: #ef4444;
}

canvas {
  max-height: 300px;
  height: 300px !important;
  width: 100% !important;
  display: block;
}
</style>
