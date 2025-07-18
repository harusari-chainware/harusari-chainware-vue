<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { fetchStoreOrderStats, fetchStoreOrderTrend, fetchAllFranchises } from '../api.js'
import { Chart, registerables } from 'chart.js'
import FilterDate from '@/components/common/filters/FilterDate.vue'

Chart.register(...registerables)

const period = ref('WEEKLY')
const franchiseId = ref('')
const targetDate = ref(getYesterday())
const franchises = ref([])
const franchiseList = ref([])
const searchKeyword = ref('')

const totalOrderCount = ref(0)
const totalOrderQuantity = ref(0)
const avgOrderQuantity = ref(0)
const topProductName = ref('-')
const topProductQty = ref('-')
const topProductShare = ref('-')

const franchiseChart = ref(null)
const productChart = ref(null)
const trendChart = ref(null)
const shouldRenderChart = ref(true)
let isFetching = false

const franchiseChartView = ref('quantity')
const trendChartView = ref('quantity')

const chartKeyMap = {
  quantity: 'totalQuantity',
  count: 'totalOrders',
  amount: 'totalAmount'
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function delayedFranchiseViewChange(view) {
  if (isFetching) return
  franchiseChartView.value = view
  setTimeout(() => loadData(), 300)
}

function delayedTrendViewChange(view) {
  if (isFetching) return
  trendChartView.value = view
  setTimeout(() => loadData(), 300)
}

function handleSearchKeyword() {
  const match = franchises.value.find(i => i.name.includes(searchKeyword.value))
  franchiseId.value = match ? match.id : ''
}

async function loadData() {
  if (isFetching) return
  isFetching = true
  try {
    shouldRenderChart.value = false
    await nextTick() // canvas DOM 제거 대기

    const [franchiseRes, productRes] = await Promise.all([
      fetchStoreOrderStats({ period: period.value, franchiseId: franchiseId.value || null, targetDate: targetDate.value }),
      fetchStoreOrderStats({ period: period.value, franchiseId: franchiseId.value || null, targetDate: targetDate.value, includeProduct: true })
    ])
    const trendsRes = await fetchStoreOrderTrend({ period: period.value, franchiseId: franchiseId.value || null, targetDate: targetDate.value })

    const stats = {
      franchiseStats: franchiseRes || [],
      productStats: productRes || [],
      trends: trendsRes || []
    }

    totalOrderCount.value = stats.franchiseStats.reduce((sum, d) => sum + (d.totalOrders || 0), 0)
    totalOrderQuantity.value = stats.franchiseStats.reduce((sum, d) => sum + (d.totalQuantity || 0), 0)
    avgOrderQuantity.value = totalOrderCount.value === 0 ? 0 : Math.round(totalOrderQuantity.value / totalOrderCount.value)

    const grouped = {}
    for (const stat of stats.productStats) {
      if (!grouped[stat.productName]) grouped[stat.productName] = { quantity: 0, amount: 0 }
      grouped[stat.productName].quantity += stat.quantity || 0
      grouped[stat.productName].amount += stat.amount || 0
    }

    const ranked = Object.entries(grouped)
        .map(([name, { quantity, amount }]) => ({ name, quantity, amount }))
        .sort((a, b) => b.quantity - a.quantity)

    const top = ranked[0]
    if (top) {
      topProductName.value = top.name
      topProductQty.value = `${top.quantity.toLocaleString()}개`
      const share = ((top.quantity / totalOrderQuantity.value) * 100).toFixed(1)
      topProductShare.value = `(${isNaN(share) ? '0' : share}%)`
    } else {
      topProductName.value = '-'
      topProductQty.value = '-'
      topProductShare.value = '-'
    }

    shouldRenderChart.value = true
    await nextTick() // canvas DOM 재생성 대기

    await drawFranchiseChart(stats.franchiseStats)
    await drawProductChart(stats.productStats)
    await drawTrendChart(stats.trends)
  } catch (err) {
    console.error(' loadData() error:', err)
  } finally {
    isFetching = false
  }
}

async function drawFranchiseChart(data) {
  if (franchiseChart.value) {
    franchiseChart.value.destroy()
    franchiseChart.value = null
  }

  const canvas = document.getElementById('franchiseOrderChart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const key = chartKeyMap[franchiseChartView.value]
  let labels = []
  let values = []

  if (!franchiseId.value) {
    const aggregated = {}
    data.forEach(d => {
      if (!aggregated[d.franchiseName]) aggregated[d.franchiseName] = 0
      aggregated[d.franchiseName] += d[key] ?? 0
    })
    labels = Object.keys(aggregated)
    values = Object.values(aggregated)
  } else {
    labels = data.map(d => d.date?.slice(5))
    values = data.map(d => d[key] ?? 0)
  }

  franchiseChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: franchiseChartView.value === 'quantity' ? '주문 수량' : '주문 건수',
        data: values,
        backgroundColor: 'rgba(79, 70, 229, 0.9)',
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
            callback: v => franchiseChartView.value === 'quantity' ? `${v}개` : `${v}건`
          }
        }
      }
    }
  })
}

async function drawProductChart(data) {
  if (productChart.value) {
    productChart.value.destroy()
    productChart.value = null
  }

  const canvas = document.getElementById('productOrderChart')
  if (!canvas || !Array.isArray(data) || data.length === 0) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const grouped = {}
  for (const stat of data) {
    if (!grouped[stat.productName]) grouped[stat.productName] = 0
    grouped[stat.productName] += stat.quantity || 0
  }

  const labels = Object.keys(grouped)
  const values = Object.values(grouped)
  const total = values.reduce((sum, val) => sum + val, 0)

  productChart.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#4b5563', '#0ea5e9', '#a855f7'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 12, padding: 15 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const value = ctx.raw
              const ratio = ((value / total) * 100).toFixed(1)
              return `수량: ${value}개 / 비율: ${ratio}%`
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}

function formatTrendLabel(dateStr) {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const week = Math.ceil((date.getDate() - date.getDay() + 1) / 7)

  if (period.value === 'WEEKLY') return `${month}월 ${week}주차`
  if (period.value === 'MONTHLY') return `${month}월`
  return dateStr.slice(5)
}

async function drawTrendChart(data) {
  if (trendChart.value) {
    trendChart.value.destroy()
    trendChart.value = null
  }

  const canvas = document.getElementById('orderTrendChart')
  if (!canvas || !Array.isArray(data)) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const key = chartKeyMap[trendChartView.value]

  trendChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => formatTrendLabel(d.date)),
      datasets: [{
        label: trendChartView.value === 'quantity' ? '주문 수량' : '주문 건수',
        data: data.map(d => d[key] ?? 0),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
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
            callback: v => trendChartView.value === 'quantity' ? `${v}개` : `${v}건`
          }
        }
      }
    }
  })
}

onMounted(async () => {
  franchises.value = await fetchAllFranchises()
  franchiseList.value = franchises.value
  await loadData()
})
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 필터 -->
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
          <label>가맹점</label>
          <select v-model="franchiseId">
            <option value="">전체 가맹점</option>
            <option v-for="item in franchiseList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>가맹점 검색</label>
          <input v-model="searchKeyword" @input="handleSearchKeyword" placeholder="이름으로 검색" />
        </div>
        <div class="form-group">
          <FilterDate label="기준일" v-model="targetDate" />
        </div>
        <div class="form-group form-action">
          <button class="primary" @click="loadData">조회</button>
        </div>
      </div>
    </div>

    <!-- 요약 카드 -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-label">총 주문 건수</div>
        <div class="summary-value">{{ totalOrderCount }}건</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">총 주문 수량</div>
        <div class="summary-value">{{ totalOrderQuantity }}개</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">평균 주문 수량</div>
        <div class="summary-value">{{ avgOrderQuantity }}개</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">최다 주문 상품</div>
        <div class="summary-value">{{ topProductName }} {{ topProductQty }} {{ topProductShare }}</div>
      </div>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          가맹점별 주문량
          <div class="tab-buttons">
            <button :class="{ active: franchiseChartView === 'quantity' }" @click="delayedFranchiseViewChange('quantity')">수량</button>
            <button :class="{ active: franchiseChartView === 'count' }" @click="delayedFranchiseViewChange('count')">건수</button>
          </div>
        </div>
        <canvas v-if="shouldRenderChart" id="franchiseOrderChart"></canvas>
      </div>

      <div class="chart-card">
        <div class="chart-header">상품별 주문량</div>
        <canvas v-if="shouldRenderChart" id="productOrderChart"></canvas>
      </div>
    </div>

    <div class="chart-card mt-6">
      <div class="chart-header">
        주문 추이
        <div class="tab-buttons">
          <button :class="{ active: trendChartView === 'quantity' }" @click="delayedTrendViewChange('quantity')">수량</button>
          <button :class="{ active: trendChartView === 'count' }" @click="delayedTrendViewChange('count')">건수</button>
        </div>
      </div>
      <canvas v-if="shouldRenderChart" id="orderTrendChart"></canvas>
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

.form-group input,
.form-group select {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
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
.tab-buttons {
  display: flex;
  gap: 0.5rem;
}
.tab-buttons button {
  background: none;
  border: none;
  font-size: 14px;
  padding: 0.25rem 0.5rem;
  color: #999;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.tab-buttons button.active {
  color: #3b82f6;
  border-color: #3b82f6;
  font-weight: bold;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-label {
  font-size: 14px;
  color: #6b7280;
}

.summary-value {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}

.chart-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-header {
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-toggle button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.chart-toggle button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

canvas {
  max-height: 300px;
  height: 300px !important;
  width: 100% !important;
  display: block;
}

.form-group.form-action {
  align-self: flex-end;
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.mt-6 {
  margin-top: 2rem;
}
.primary:hover {
  background-color: #2c91bc;
}
</style>

