<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import {
  fetchPurchaseOrderStats as fetchVendorStatistics,
  fetchPurchaseOrderTrend as fetchOrderTrend,
  fetchAllVendors
} from '../api.js'
import Chart from 'chart.js/auto'
import FilterDate from "@/components/common/filters/FilterDate.vue"

Chart.defaults.font.family = 'Noto Sans KR, sans-serif'

const period = ref('WEEKLY')
const vendorId = ref('')
const targetDate = ref(getYesterday())

const totalOrderCount = ref(0)
const totalOrderAmount = ref(0)

const vendorChart = ref(null)
const productChart = ref(null)
const trendChart = ref(null)

const vendorCanvas = ref(null)
const productCanvas = ref(null)
const trendCanvas = ref(null)

const shouldRenderChart = ref(true)

const vendorChartView = ref('amount')
const trendChartView = ref('amount')

const vendors = ref([])
const vendorList = ref([])
const vendorSearchKeyword = ref('')

const latestStats = ref([])
const latestProductStats = ref([])
const latestTrendStats = ref([])

function getYesterday() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

const formatCurrency = (val) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(val)

function handleVendorSearch() {
  const match = vendors.value.find(v => v.name.includes(vendorSearchKeyword.value))
  vendorId.value = match ? match.id : ''
}

async function loadStatistics() {
  const stats = await fetchVendorStatistics({
    period: period.value,
    vendorId: vendorId.value || null,
    targetDate: targetDate.value || null,
    includeProduct: true
  })

  const productStats = stats.filter(s => !!s.productName)

  const vendorMap = new Map()
  for (const item of productStats) {
    const name = item.vendorName
    if (!vendorMap.has(name)) {
      vendorMap.set(name, { vendorName: name, totalCount: 0, totalAmount: 0 })
    }
    vendorMap.get(name).totalCount += 1
    vendorMap.get(name).totalAmount += item.amount
  }

  const vendorStats = Array.from(vendorMap.values())

  totalOrderCount.value = vendorStats.reduce((sum, v) => sum + v.totalCount, 0)
  totalOrderAmount.value = vendorStats.reduce((sum, v) => sum + v.totalAmount, 0)

  latestStats.value = stats
  latestProductStats.value = productStats
}

async function loadTrend() {
  const trend = await fetchOrderTrend({
    period: period.value,
    vendorId: vendorId.value || null,
    targetDate: targetDate.value || null
  })

  latestTrendStats.value = trend
}

async function onSearch() {
  shouldRenderChart.value = false
  await nextTick()
  await loadStatistics()
  await loadTrend()
  shouldRenderChart.value = true
  await nextTick()
  requestAnimationFrame(() => {
    drawVendorChart(latestStats.value)
    drawProductChart(latestProductStats.value)
    drawTrendChart(latestTrendStats.value)
  })
}

function drawVendorChart(data) {
  if (!vendorCanvas.value) return
  const ctx = vendorCanvas.value.getContext('2d')
  if (!ctx) return
  if (vendorChart.value) vendorChart.value.destroy()

  let labels = []
  let values = []

  if (vendorId.value) {
    const dateMap = new Map()
    for (const item of data) {
      const dateKey = item.date?.slice(5).replace('-', '/')
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { totalAmount: 0, totalCount: 0 })
      }
      dateMap.get(dateKey).totalAmount += item.amount || 0
      dateMap.get(dateKey).totalCount += 1
    }

    labels = [...dateMap.keys()]
    values = vendorChartView.value === 'amount'
        ? [...dateMap.values()].map(v => v.totalAmount)
        : [...dateMap.values()].map(v => v.totalCount)
  } else {
    const vendorMap = new Map()
    for (const item of data) {
      const name = item.vendorName
      if (!vendorMap.has(name)) {
        vendorMap.set(name, { totalAmount: 0, totalCount: 0 })
      }
      vendorMap.get(name).totalAmount += item.amount || 0
      vendorMap.get(name).totalCount += 1
    }

    labels = [...vendorMap.keys()]
    values = vendorChartView.value === 'amount'
        ? [...vendorMap.values()].map(v => v.totalAmount)
        : [...vendorMap.values()].map(v => v.totalCount)
  }

  vendorChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: vendorChartView.value === 'amount' ? '발주 금액' : '발주 건수',
        data: values,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: val =>
                vendorChartView.value === 'amount'
                    ? `${(val / 10000).toFixed(1)}만`
                    : `${val}건`
          }
        }
      }
    }
  })
}

function drawProductChart(data) {
  if (!productCanvas.value) return
  const ctx = productCanvas.value.getContext('2d')
  if (!ctx) return
  if (productChart.value) productChart.value.destroy()

  const labels = data.map(d => `${d.vendorName} - ${d.productName}`)
  const values = data.map(d => d.amount)
  const total = values.reduce((sum, val) => sum + val, 0)

  productChart.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: chartColors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const value = ctx.raw
              const label = (ctx.label || '').split('\n')[0]
              const ratio = ((value / total) * 100).toFixed(1)
              const amount = value.toLocaleString('ko-KR')
              return [`${label}: ₩${amount} (${ratio}%)`]
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}

function drawTrendChart(data) {
  if (!trendCanvas.value) return
  const ctx = trendCanvas.value.getContext('2d')
  if (!ctx) return
  if (trendChart.value) trendChart.value.destroy()

  const labels = data.map(d => d.date.slice(5).replace('-', '/'))
  const values = trendChartView.value === 'amount'
      ? data.map(d => d.totalAmount)
      : data.map(d => d.totalCount)

  trendChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: trendChartView.value === 'amount' ? '발주 금액' : '발주 건수',
        data: values,
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        borderColor: 'rgba(96, 165, 250, 1)',
        pointBackgroundColor: 'rgba(96, 165, 250, 1)',
        pointRadius: 4,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: val =>
                trendChartView.value === 'amount'
                    ? `${(val / 10000).toFixed(1)}만`
                    : `${val}건`
          }
        }
      }
    }
  })
}

const chartColors = [
  'rgba(96, 165, 250, 0.8)', 'rgba(34, 197, 94, 0.8)',
  'rgba(251, 191, 36, 0.8)', 'rgba(244, 114, 182, 0.8)',
  'rgba(139, 92, 246, 0.8)', 'rgba(79, 70, 229, 0.8)',
  'rgba(16, 185, 129, 0.8)', 'rgba(236, 72, 153, 0.8)',
  'rgba(253, 224, 71, 0.8)', 'rgba(34, 211, 238, 0.8)',
  'rgba(245, 158, 11, 0.8)', 'rgba(132, 204, 22, 0.8)',
  'rgba(236, 72, 72, 0.8)', 'rgba(192, 132, 252, 0.8)',
  'rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)'
]

onMounted(async () => {
  vendors.value = await fetchAllVendors()
  vendorList.value = vendors.value
  await onSearch()
})
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 필터 영역 -->
    <div class="filter-box">
      <div class="filter-grid">
        <div class="form-group">
          <label>조회 주기</label>
          <select v-model="period">
            <option value="DAILY">일간</option>
            <option value="WEEKLY">주간</option>
            <option value="MONTHLY">월간</option>
          </select>
        </div>

        <div class="form-group">
          <label>거래처</label>
          <select v-model="vendorId">
            <option value="">전체 거래처</option>
            <option v-for="vendor in vendorList" :key="vendor.id" :value="vendor.id">
              {{ vendor.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>거래처 검색</label>
          <input v-model="vendorSearchKeyword" @input="handleVendorSearch" placeholder="거래처 이름 검색" />
        </div>

        <div class="form-group">
          <FilterDate label="기준일" v-model="targetDate" />
        </div>

        <div class="form-group form-action">
          <button class="primary" @click="onSearch">조회</button>
        </div>
      </div>
    </div>

    <!-- 요약 카드 -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-label">총 발주 건수</div>
        <div class="summary-value">{{ totalOrderCount }}건</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">총 발주 금액</div>
        <div class="summary-value">{{ formatCurrency(totalOrderAmount) }}</div>
      </div>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-section">
      <!-- 거래처별 발주량 -->
      <div class="chart-card">
        <div class="chart-header">
          <span>거래처별 발주량</span>
          <div class="chart-toggle">
            <button :class="{ active: vendorChartView === 'amount' }" @click="vendorChartView = 'amount'; onSearch()">금액</button>
            <button :class="{ active: vendorChartView === 'count' }" @click="vendorChartView = 'count'; onSearch()">건수</button>
          </div>
        </div>
        <canvas v-if="shouldRenderChart" ref="vendorCanvas" height="240"></canvas>
      </div>

      <!-- 상품별 발주량 -->
      <div class="chart-card">
        <div class="chart-header"><span>상품별 발주량</span></div>
        <div class="product-chart-container">
          <canvas v-if="shouldRenderChart" ref="productCanvas" height="240"></canvas>
          <div class="custom-legend">
            <div
                class="legend-item"
                v-for="(item, index) in latestProductStats"
                :key="index"
            >
      <span
          class="legend-color"
          :style="{ backgroundColor: chartColors[index % chartColors.length] }"
      ></span>
              <span class="legend-label">
        {{ item.vendorName }} - {{ item.productName }}
      </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 발주 추이 -->
    <div class="chart-card mt-4">
      <div class="chart-header">
        <span>발주 추이</span>
        <div class="chart-toggle">
          <button :class="{ active: trendChartView === 'amount' }" @click="trendChartView = 'amount'; onSearch()">금액</button>
          <button :class="{ active: trendChartView === 'count' }" @click="trendChartView = 'count'; onSearch()">건수</button>
        </div>
      </div>
      <canvas v-if="shouldRenderChart" ref="trendCanvas" height="300"></canvas>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f9fafb;
}

.filter-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filter-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 14px;
  color: #555;
}

.form-group select,
.form-group input {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.form-group.form-action {
  align-self: flex-end;
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

button.primary {
  background-color: rgb(58, 174, 216);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: bold;
}

.chart-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
  font-size: 16px;
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

canvas {
  max-height: 300px;
  height: 300px !important;
  width: 100% !important;
  display: block;
}

.mt-4 {
  margin-top: 2rem;
}
.product-chart-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.product-chart-container canvas {
  flex: 1;
  max-width: 70%; /* 도넛 차트 너비 제한 */
}

.product-chart-container {
  display: flex;
  gap: 1rem;
}

.product-chart-container canvas {
  flex: 1;
  max-width: 70%;
}

.custom-legend {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 150px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.3;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}

.legend-label {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-chart-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.product-chart-container canvas {
  flex: 0 0 50%; /* 차트가 전체 영역의 절반만 차지 */
  max-width: 50%;
}
.primary:hover {
  background-color: #2c91bc;
}
</style>