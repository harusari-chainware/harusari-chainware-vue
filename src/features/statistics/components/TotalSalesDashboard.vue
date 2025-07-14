<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { fetchTotalSales, fetchSalesPattern, fetchAllFranchises } from '../api.js'
import { Chart, registerables } from 'chart.js'
import FilterDate from "@/components/common/filters/FilterDate.vue"

Chart.register(...registerables)

const franchiseId = ref('')
const period = ref('DAILY')
const targetDate = ref(getYesterday())

const franchiseList = ref([])
const searchKeyword = ref('')

const todaySales = ref(0)
const yesterdaySales = ref(0)
const growthRate = ref(0)

const peakHour = ref('')
const peakHourAmount = ref(0)
const peakDay = ref('')
const peakDayAmount = ref(0)

const pattern = ref('HOURLY')
const salesPatternChart = ref(null)
const shouldRenderChart = ref(true)

const salesChartSubtitle = ref('시간대별 매출 추이')
const subtitleMap = {
  HOURLY: '시간대별 매출 추이',
  WEEKLY: '요일별 매출 추이',
  MONTHLY: '일자별 매출 추이'
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

const formatCurrency = (val) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(val)

function handleSearchKeyword() {
  const keyword = searchKeyword.value?.trim()
  if (!keyword) {
    franchiseId.value = ''
    return
  }

  const match = franchiseList.value.find(i => i.name.includes(keyword))
  franchiseId.value = match ? match.id : ''
}

async function loadSalesData() {
  try {
    const data = await fetchTotalSales({
      period: period.value,
      franchiseId: franchiseId.value || null,
      targetDate: targetDate.value || null
    })

    todaySales.value = data.totalSalesAmount ?? 0
    growthRate.value = isFinite(data.changeRate) ? data.changeRate : 0

    if (isFinite(data.changeRate) && data.changeRate !== -100) {
      const estimated = todaySales.value / (1 + data.changeRate / 100)
      yesterdaySales.value = Math.round(estimated)
    } else {
      yesterdaySales.value = 0
    }
  } catch (err) {
    console.error('총 매출 통계 조회 실패:', err)
  }
}

async function drawSalesPatternChart() {
  try {
    const [hourlyData, weeklyData, dynamicData] = await Promise.all([
      fetchSalesPattern({ period: 'HOURLY', franchiseId: franchiseId.value || null, targetDate: targetDate.value }),
      fetchSalesPattern({ period: 'WEEKLY', franchiseId: franchiseId.value || null, targetDate: targetDate.value }),
      fetchSalesPattern({ period: pattern.value, franchiseId: franchiseId.value || null, targetDate: targetDate.value })
    ])

    updatePeakHour(hourlyData)
    updatePeakDay(weeklyData)

    await nextTick()

    const canvas = document.getElementById('salesPatternChart')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (salesPatternChart.value) salesPatternChart.value.destroy()

    const labels = dynamicData.map(i =>
        pattern.value === 'MONTHLY' ? i.date?.slice(5) :
            pattern.value === 'WEEKLY' ? i.weekday :
                `${i.hour}시`
    )
    const values = dynamicData.map(i => i.totalAmount)

    salesPatternChart.value = new Chart(ctx, {
      type: pattern.value === 'WEEKLY' ? 'bar' : 'line',
      data: {
        labels,
        datasets: [{
          label: '매출액',
          data: values,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: val => val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val
            }
          }
        }
      }
    })
  } catch (err) {
    console.error('매출 패턴 차트 렌더링 실패:', err)
  }
}

function updatePeakHour(data) {
  const maxItem = data.find(i => i.max)
  peakHour.value = maxItem ? `${maxItem.hour}-${(maxItem.hour + 1) % 24}시` : ''
  peakHourAmount.value = maxItem ? maxItem.totalAmount : 0
}

function updatePeakDay(data) {
  const maxItem = data.find(i => i.max)
  peakDay.value = maxItem ? `${maxItem.weekday}요일` : ''
  peakDayAmount.value = maxItem ? maxItem.totalAmount : 0
}

async function onPatternTabClick(p) {
  pattern.value = p
  salesChartSubtitle.value = subtitleMap[p]
  shouldRenderChart.value = false
  await nextTick()
  shouldRenderChart.value = true
  await nextTick()
  drawSalesPatternChart()
}

async function resetForm() {
  franchiseId.value = ''
  period.value = 'DAILY'
  targetDate.value = getYesterday()
  await loadSalesData()
  await onPatternTabClick('HOURLY')
}

onMounted(async () => {
  franchiseList.value = await fetchAllFranchises()
  await resetForm()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 통계 조회 필터 -->
    <div class="filter-box">
      <div class="filter-grid">
        <div class="form-group">
          <label>조회 기간</label>
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
        <div class="form-actions">
          <button @click="resetForm">초기화</button>
          <button class="primary" @click="loadSalesData">조회</button>
        </div>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="card-grid">
      <div class="stat-card">
        <div class="stat-title">오늘 매출</div>
        <div class="stat-value">{{ formatCurrency(todaySales) }}</div>
        <div class="stat-description">오늘 기준</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">어제 매출</div>
        <div class="stat-value">{{ formatCurrency(yesterdaySales) }}</div>
        <div class="stat-description">어제 기준</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">전일 대비 증감률</div>
        <div class="stat-value" :class="growthRate >= 0 ? 'positive' : 'negative'">
          {{ growthRate.toFixed(1) }}%
        </div>
        <div class="stat-description">전일 대비</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">최고 매출 시간대</div>
        <div class="stat-value">{{ peakHour }}</div>
        <div class="stat-description">{{ formatCurrency(peakHourAmount) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">최고 매출 요일</div>
        <div class="stat-value">{{ peakDay }}</div>
        <div class="stat-description">{{ formatCurrency(peakDayAmount) }}</div>
      </div>
    </div>

    <!-- 매출 추이 차트 -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3>매출 추이</h3>
            <p class="chart-subtitle">{{ salesChartSubtitle }}</p>
          </div>
          <div class="tab-buttons">
            <button
                v-for="tab in ['HOURLY','WEEKLY','MONTHLY']"
                :key="tab"
                @click="onPatternTabClick(tab)"
                :class="{ active: pattern === tab }"
            >
              {{ tab === 'HOURLY' ? '시간대별' : tab === 'WEEKLY' ? '요일별' : '일자별' }}
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas v-if="shouldRenderChart" id="salesPatternChart" width="700" height="300"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.dashboard-container {
padding: 24px;
font-family: sans-serif;
}

.section-title {
font-size: 18px;
font-weight: 600;
margin-bottom: 12px;
}

.filter-box {
background: #fff;
padding: 24px;
border-radius: 12px;
box-shadow: 0 2px 6px rgba(0,0,0,0.05);
margin-bottom: 24px;
}

.filter-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
gap: 16px;
align-items: end;
}

.form-group label {
font-size: 14px;
color: #555;
margin-bottom: 4px;
display: block;
}

.form-group select,
.form-group input {
width: 100%;
padding: 8px;
border-radius: 6px;
border: 1px solid #ccc;
font-size: 14px;
}

.form-actions {
display: flex;
gap: 8px;
}

.form-actions button {
flex: 1;
padding: 8px;
font-size: 14px;
border-radius: 6px;
border: 1px solid #ccc;
background: #f5f5f5;
cursor: pointer;
}

.form-actions .primary {
background:  rgb(58, 174, 216);
color: white;
border: none;
}

.card-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
gap: 16px;
margin-bottom: 24px;
}

.stat-card {
background: white;
padding: 16px;
border-radius: 12px;
box-shadow: 0 2px 6px rgba(0,0,0,0.05);
text-align: center;
}

.stat-title {
font-size: 14px;
color: #6b7280;
margin-bottom: 4px;
}

.stat-value {
font-size: 20px;
font-weight: bold;
color: #1f2937;
}

.stat-value.positive { color: #10b981; }
.stat-value.negative { color: #ef4444; }

.stat-description {
font-size: 12px;
color: #9ca3af;
}

.chart-section {
display: flex;
flex-direction: column;
gap: 24px;
}

.chart-card {
background: white;
border-radius: 12px;
padding: 24px;
box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.chart-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 12px;
}

.chart-subtitle {
font-size: 12px;
color: #888;
}

.tab-buttons button {
background: none;
border: none;
font-size: 14px;
margin-right: 8px;
padding-bottom: 4px;
cursor: pointer;
color: #999;
border-bottom: 2px solid transparent;
}

.tab-buttons button.active {
color: #4f46e5;
border-bottom: 2px solid #4f46e5;
}

.chart-container {
height: 380px;
width: 100%;
}

.chart-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: 24px;
}
canvas {
  display: block;
  width: 95% !important;
  height: 360px !important;
}

#weeklyDistributionChart {
  width: 65% !important;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#hourlyDistributionChart {
  width: 85% !important;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>