<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import FilterDate from '@/components/common/filters/FilterDate.vue'
import {
  fetchInventoryTurnover,
  fetchInventoryTurnoverTrend,
  fetchAllFranchises,
  fetchAllWarehouses
} from '@/features/statistics/api.js'

const period = ref('MONTHLY')
const locationType = ref('warehouse')
const locationId = ref('')
const targetDate = ref(getYesterday())
const franchises = ref([])
const warehouses = ref([])
const searchKeyword = ref('')
const isLoading = ref(false)

const trendChartRef = ref(null)
const productChartRef = ref(null)
const trendCanvasEl = ref(null)
const productCanvasEl = ref(null)
const showTrendChart = ref(false)
const showProductChart = ref(false)

const trendRes = ref([])
const productDataRaw = ref([])
const productTab = ref('top')

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function formatXAxisLabels(dates, period) {
  if (period === 'WEEKLY') {
    return dates.map(dateStr => {
      const date = new Date(dateStr)
      const month = date.getMonth() + 1
      const week = Math.ceil(date.getDate() / 7)
      return `${month}월 ${week}주차`
    })
  }
  if (period === 'MONTHLY') {
    return dates.map(dateStr => {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}월`
    })
  }
  return dates
}

async function loadLocationOptions() {
  if (locationType.value === 'warehouse') {
    warehouses.value = await fetchAllWarehouses()
  } else {
    franchises.value = await fetchAllFranchises()
  }
}

function handleSearchKeyword() {
  const list = locationType.value === 'warehouse' ? warehouses.value : franchises.value
  const match = list.find(i => i.name.includes(searchKeyword.value))
  locationId.value = match ? match.id : ''
}

async function handleSearch() {
  try {
    isLoading.value = true
    showTrendChart.value = false
    showProductChart.value = false

    const trendParams = { period: period.value, targetDate: targetDate.value }
    const productParams = { period: period.value, targetDate: targetDate.value }

    if (locationType.value === 'warehouse' && locationId.value) {
      trendParams.warehouseId = Number(locationId.value)
      productParams.warehouseId = Number(locationId.value)
    } else if (locationType.value === 'franchise' && locationId.value) {
      trendParams.franchiseId = Number(locationId.value)
      productParams.franchiseId = Number(locationId.value)
    }

    trendRes.value = await fetchInventoryTurnoverTrend(trendParams)
    productDataRaw.value = await fetchInventoryTurnover(productParams)

    await nextTick()
    showTrendChart.value = true
    showProductChart.value = true
  } catch (err) {
    console.error(' 재고 회전율 데이터 로드 실패:', err)
  } finally {
    isLoading.value = false
  }
}

function delayedSearch(newPeriod) {
  isLoading.value = true
  period.value = newPeriod
  setTimeout(() => handleSearch(), 300)
}

function changeProductTab(tab) {
  productTab.value = tab
  drawProductChart()
}

watch(showTrendChart, async (v) => {
  if (v) {
    await nextTick()
    requestAnimationFrame(drawTrendChart)
  }
})

watch(showProductChart, async (v) => {
  if (v) {
    await nextTick()
    requestAnimationFrame(drawProductChart)
  }
})

function drawTrendChart() {
  const canvas = trendCanvasEl.value
  if (!canvas || typeof canvas.getContext !== 'function') return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (trendChartRef.value && typeof trendChartRef.value.destroy === 'function') {
    trendChartRef.value.destroy()
  }

  const data = {
    labels: formatXAxisLabels(trendRes.value.map(i => i.date), period.value),
    datasets: [
      {
        label: '재고 회전율',
        data: trendRes.value.map(i => i.turnoverRate),
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        borderColor: 'rgba(96, 165, 250, 1)',
        pointBackgroundColor: 'rgba(96, 165, 250, 1)',
        fill: true,
        tension: 0.3
      }
    ]
  }

  trendChartRef.value = new Chart(ctx, {
    type: 'line',
    data,
    options: chartOptions('y', 'x')
  })
}

function drawProductChart() {
  const canvas = productCanvasEl.value
  if (!canvas || typeof canvas.getContext !== 'function') return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (productChartRef.value && typeof productChartRef.value.destroy === 'function') {
    productChartRef.value.destroy()
  }

  const source = [...productDataRaw.value]

  // ✅ 유효한 데이터만 필터링
  const validData = source.filter(i =>
      typeof i.turnoverRate === 'number' && !isNaN(i.turnoverRate)
  )

  // ✅ 정렬 및 상위/하위 10개 추출
  const sorted =
      productTab.value === 'top'
          ? validData.sort((a, b) => b.turnoverRate - a.turnoverRate).slice(0, 10)
          : validData.sort((a, b) => a.turnoverRate - b.turnoverRate).slice(0, 10)

  // ✅ 디버깅용 콘솔 로그
  console.log('📦 productDataRaw:', productDataRaw.value)
  console.log('✅ validData:', validData)
  console.log('🎯 sorted:', sorted)

  const data = {
    labels: sorted.map(i => i.productName),
    datasets: [
      {
        label: '재고 회전율',
        data: sorted.map(i => i.turnoverRate),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        barThickness: 30  // ✅ 막대 너비 강제 설정
      }
    ]
  }

  productChartRef.value = new Chart(ctx, {
    type: 'bar',
    data,
    options: chartOptions('x', 'y')  // x = value axis, y = category axis
  })
}

function chartOptions(valueAxis, categoryAxis) {
  return {
    indexAxis: valueAxis === 'x' ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed[valueAxis]}회`
        }
      }
    },
    scales: {
      [valueAxis]: {
        beginAtZero: true,
        ticks: { callback: v => `${v}회` },
        grid: { color: '#f3f4f6' }
      },
      [categoryAxis]: {
        ticks: { autoSkip: false },
        grid: { color: '#f9fafb' }
      }
    }
  }
}

onMounted(() => {
  handleSearch()
  loadLocationOptions()
})

watch(locationType, () => {
  locationId.value = ''
  searchKeyword.value = ''
  loadLocationOptions()
})
</script>

<template>
  <div class="dashboard">
    <div class="filter-box">
      <div class="filter-grid">
        <div class="filter-item">
          <label>조회 기간</label>
          <select v-model="period">
            <option v-if="locationType !== 'franchise'" value="DAILY">일간</option>
            <option v-if="locationType !== 'franchise'" value="WEEKLY">주간</option>
            <option value="MONTHLY">월간</option>
          </select>
        </div>
        <div class="filter-item">
          <label>위치</label>
          <select v-model="locationType">
            <option value="warehouse">본사 창고</option>
            <option v-if="period === 'MONTHLY'" value="franchise">가맹점</option>
          </select>
        </div>
        <div class="filter-item">
          <label>선택</label>
          <select v-model="locationId">
            <option disabled value="">선택하세요</option>
            <option v-if="locationType === 'warehouse'" value="">전체 본사 창고</option>
            <option
                v-for="item in locationType === 'warehouse' ? warehouses : franchises"
                :key="item.id"
                :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>검색</label>
          <input
              v-model="searchKeyword"
              placeholder="이름으로 검색"
              @input="handleSearchKeyword"
          />
        </div>
        <div class="form-group">
          <FilterDate label="기준일" v-model="targetDate" />
        </div>
        <div class="filter-item">
          <label style="visibility: hidden">조회</label>
          <button class="btn-search" :disabled="isLoading" @click="handleSearch">조회</button>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-card col-8">
        <div class="chart-header">
          <h3>재고 회전율 추이</h3>
          <div class="tab-buttons">
            <button :class="{ active: period === 'DAILY' }" @click="() => delayedSearch('DAILY')">일간</button>
            <button :class="{ active: period === 'WEEKLY' }" @click="() => delayedSearch('WEEKLY')">주간</button>
            <button :class="{ active: period === 'MONTHLY' }" @click="() => delayedSearch('MONTHLY')">월간</button>
          </div>
        </div>
        <canvas v-if="showTrendChart" id="turnoverTrendChart" ref="trendCanvasEl"></canvas>
      </div>

      <div class="chart-card col-4">
        <div class="chart-header">
          <h3>제품별 재고 회전율</h3>
          <div class="tab-buttons">
            <button :class="{ active: productTab === 'top' }" @click="() => changeProductTab('top')">상위 10개</button>
            <button :class="{ active: productTab === 'bottom' }" @click="() => changeProductTab('bottom')">하위 10개</button>
          </div>
        </div>
        <canvas v-if="showProductChart" id="productTurnoverChart" ref="productCanvasEl"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  background-color: #f7f9fc;
  font-family: 'Noto Sans KR', sans-serif;
}
.filter-box {
  background: #fff;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.filter-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: flex-end;
}
.filter-item, .form-group {
  flex: 1 1 0;
  min-width: 160px;
  display: flex;
  flex-direction: column;
}
.filter-item label {
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
  font-weight: 500;
}
.filter-item select,
.filter-item input {
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.btn-search {
  margin-top: auto;
  height: 38px;
  background-color: rgb(58, 174, 216);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}
.chart-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.chart-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.chart-card.col-4 {
  grid-column: span 4;
}
.chart-card.col-8 {
  grid-column: span 8;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>