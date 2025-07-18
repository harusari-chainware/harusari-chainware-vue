<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { fetchAccuracySummary, fetchAllFranchises } from '@/features/statistics/api.js'
import FilterDate from "@/components/common/filters/FilterDate.vue"

const franchiseId = ref('')
const franchiseKeyword = ref('')
const periodType = ref('WEEKLY')
const targetDate = ref(new Date(Date.now() - 86400000).toISOString().split('T')[0])
const predictionType = ref('sales')
const chartRef = ref(null)
const franchiseList = ref([])
const shouldRenderChart = ref(true)

const labelMap = {
  sales: '매출',
  order: '주문 수량',
  purchase: '발주 수량'
}

const accuracy = ref({
  mape: '-', mapeTrend: '0%',
  mae: '-', maeTrend: '0',
  rmse: '-', rmseTrend: '0'
})

const unitMap = computed(() => {
  const type = predictionType.value
  return {
    mape: '%',
    mae: type === 'sales' ? '원' : '수량',
    rmse: type === 'sales' ? '원' : '수량'
  }
})

function formatMetric(metric) {
  const val = accuracy.value[metric]
  const unit = unitMap.value[metric]
  if (val === '-' || val === undefined) return '-'
  const num = parseFloat(val)
  const formatted = metric === 'mape'
      ? `${num.toFixed(2)}`
      : `${Math.round(num).toLocaleString()}`
  return `${formatted}${unit}`
}

function calcTrend(current, previous) {
  if (previous === 0 || previous === '-') return '0'
  const diff = current - previous
  const ratio = (diff / previous) * 100
  const symbol = diff >= 0 ? '+' : ''
  return `${symbol}${ratio.toFixed(2)}%`
}

let isFetching = false

async function fetchAccuracy() {
  if (isFetching) return
  isFetching = true
  try {
    shouldRenderChart.value = false // 🔁 canvas 제거
    await nextTick()               // DOM에서 제거 완료 대기

    const [thisWeek, lastWeek] = await Promise.all([
      fetchAccuracySummary({
        predictionType: predictionType.value,
        periodType: periodType.value,
        targetDate: targetDate.value,
        franchiseId: franchiseId.value || null
      }),
      fetchAccuracySummary({
        predictionType: predictionType.value,
        periodType: periodType.value,
        targetDate: new Date(new Date(targetDate.value).getTime() - 7 * 86400000).toISOString().split('T')[0],
        franchiseId: franchiseId.value || null
      })
    ])

    const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)

    const thisStats = {
      mae: parseFloat(avg(thisWeek.map(d => d.mae))),
      rmse: parseFloat(avg(thisWeek.map(d => d.rmse))),
      mape: parseFloat(avg(thisWeek.map(d => d.mape ?? 0)))
    }

    const lastStats = {
      mae: parseFloat(avg(lastWeek.map(d => d.mae))),
      rmse: parseFloat(avg(lastWeek.map(d => d.rmse))),
      mape: parseFloat(avg(lastWeek.map(d => d.mape ?? 0)))
    }

    accuracy.value = {
      comparisonChart: {
        labels: thisWeek.map(d => new Date(d.targetDate).toISOString().slice(5, 10)),
        actual: thisWeek.map(d => d.actualTotal),
        predicted: thisWeek.map(d => d.predictedTotal)
      },
      mae: thisStats.mae,
      rmse: thisStats.rmse,
      mape: thisStats.mape,
      maeTrend: calcTrend(thisStats.mae, lastStats.mae),
      rmseTrend: calcTrend(thisStats.rmse, lastStats.rmse),
      mapeTrend: calcTrend(thisStats.mape, lastStats.mape)
    }

    await nextTick()
    shouldRenderChart.value = true // 🔁 다시 렌더
    await nextTick()

    drawChart(accuracy.value.comparisonChart)
  } finally {
    isFetching = false
  }
}

function drawChart(chartData) {
  const canvas = document.getElementById('dummyAccuracyChart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (chartRef.value) {
    chartRef.value.destroy()
    chartRef.value = null
  }

  chartRef.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: '실적',
          data: chartData.actual,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '예측',
          data: chartData.predicted,
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
      scales: { y: { beginAtZero: false } }
    }
  })
}

function handleSearch() {
  fetchAccuracy()
}

function trendColor(trend) {
  return trend?.startsWith('-') ? 'text-green-500' : 'text-red-500'
}

function handleSearchKeyword() {
  const keyword = franchiseKeyword.value.trim()
  if (!keyword) {
    franchiseId.value = ''
    return
  }
  const match = franchiseList.value.find(f => f.name.includes(keyword))
  franchiseId.value = match ? match.id : ''
}

onMounted(async () => {
  franchiseList.value = await fetchAllFranchises()
  await fetchAccuracy()
})
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 필터 -->
    <div class="header-bar">
      <div class="filter-group">
        <input v-model="franchiseKeyword" @input="handleSearchKeyword" placeholder="가맹점명 검색" />
        <select v-model="franchiseId">
          <option value="">전체 가맹점</option>
          <option v-for="f in franchiseList" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
        <div class="filter-date-wrapper">
          <FilterDate v-model="targetDate" />
        </div>
        <button class="filter-label invisible" @click="handleSearch">조회</button>
      </div>
    </div>

    <!-- 예측 유형 탭 -->
    <div class="prediction-tab-bar">
      <button :class="{ active: predictionType === 'sales' }" @click="predictionType = 'sales'; handleSearch()">매출</button>
      <button :class="{ active: predictionType === 'order' }" @click="predictionType = 'order'; handleSearch()">주문 수량</button>
      <button :class="{ active: predictionType === 'purchase' }" @click="predictionType = 'purchase'; handleSearch()">발주 수량</button>
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
          <canvas v-if="shouldRenderChart" id="dummyAccuracyChart" height="280"></canvas>
        </div>
      </div>

      <div class="accuracy-card">
        <div class="accuracy-header">{{ labelMap[predictionType] }} 예측 정확도</div>
        <div class="accuracy-metric-container">
          <div class="accuracy-metric" v-for="metric in ['mape', 'mae', 'rmse']" :key="metric">
            <div class="metric-row">
              <span class="metric-title">{{ metric.toUpperCase() }}</span>
              <span class="metric-value">{{ formatMetric(metric) }}</span>
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
  margin-bottom: 20px;
}
.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}
.filter-group > * {
  display: flex;
  align-items: center;
}
.filter-group input,
.filter-group select,
.filter-group button {
  height: 36px;
  padding: 0 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.filter-group button {
  background-color: rgb(58, 174, 216);
  color: white;
  font-weight: 600;
  width: 180px;
  justify-content: center;
}
.filter-date-wrapper {
  display: flex;
  align-items: center;
  height: 36px;
}
:deep(.filter-date) {
  height: 36px !important;
  padding: 0 10px !important;
  font-size: 14px;
  line-height: 36px !important;
  vertical-align: middle !important;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  margin: 0 !important;
}
:deep(.filter-date-wrapper .filter-label) {
  display: none !important;
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
.filter-group button:hover {
  background-color: #2c91bc;
}
</style>

