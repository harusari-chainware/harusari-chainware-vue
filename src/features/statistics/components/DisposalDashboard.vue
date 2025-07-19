<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import FilterDate from '@/components/common/filters/FilterDate.vue'
import {
  fetchDisposalRate,
  fetchDisposalTrend,
  fetchAllWarehouses,
  fetchAllFranchises
} from '@/features/statistics/api.js'

const period = ref('WEEKLY')
const locationType = ref('all')
const locationId = ref('')
const targetDate = ref(new Date(Date.now() - 86400000).toISOString().split('T')[0])
const warehouses = ref([])
const franchises = ref([])
const searchKeyword = ref('')

const isLoading = ref(false)
const isSearching = ref(false)
const shouldRenderChart = ref(true)

const trendChartRef = ref(null)
const productChartRef = ref(null)

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

function extractAllLabelsFromBackend(trendRes, period) {
  const allDates = [
    ...trendRes.total.map(i => i.date),
    ...trendRes.headquarters.map(i => i.date),
    ...trendRes.franchises.map(i => i.date)
  ]
  const labelSet = new Set(
      period === 'MONTHLY'
          ? allDates.map(d => `${new Date(d).getMonth() + 1}월`)
          : formatXAxisLabels(allDates, period)
  )
  return Array.from(labelSet).sort((a, b) => a.localeCompare(b, 'ko-KR', { numeric: true }))
}

function alignDataByLabels(dataArr, labels, period) {
  const keyFunc = i =>
      period === 'MONTHLY'
          ? `${new Date(i.date).getMonth() + 1}월`
          : formatXAxisLabels([i.date], period)[0]

  const dataMap = Object.fromEntries(dataArr.map(i => [keyFunc(i), i.disposalRate]))
  return labels.map(label => dataMap[label] ?? 0)
}

async function loadLocationOptions() {
  if (locationType.value === 'warehouse') {
    warehouses.value = await fetchAllWarehouses()
  } else if (locationType.value === 'franchise') {
    franchises.value = await fetchAllFranchises()
  }
}

function handleSearchKeyword() {
  const list = locationType.value === 'warehouse' ? warehouses.value : franchises.value
  const match = list.find(i => i.name.includes(searchKeyword.value))
  locationId.value = match ? match.id : ''
}

async function waitForCanvasReady(ids) {
  let attempts = 10
  while (attempts-- > 0) {
    await nextTick()
    const allExist = ids.every(id => document.getElementById(id))
    if (allExist) return
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  console.warn('❗️ 일부 canvas 요소가 DOM에 생성되지 않았습니다.')
}

async function handleSearch() {
  try {
    isLoading.value = true
    isSearching.value = true

    const trendParams = {
      period: period.value,
      targetDate: targetDate.value || undefined
    }
    const productParams = {
      period: period.value,
      targetDate: targetDate.value || undefined,
      includeProduct: true
    }

    if (locationType.value === 'warehouse' && locationId.value) {
      trendParams.warehouseId = Number(locationId.value)
      productParams.warehouseId = Number(locationId.value)
    } else if (locationType.value === 'franchise' && locationId.value) {
      trendParams.franchiseId = Number(locationId.value)
      productParams.franchiseId = Number(locationId.value)
    }

    const trendRes = await fetchDisposalTrend(trendParams)
    const allLabels = extractAllLabelsFromBackend(trendRes, period.value)

    const trendData = locationType.value === 'all'
        ? {
          labels: allLabels,
          datasets: [
            {
              label: '전체',
              data: alignDataByLabels(trendRes.total, allLabels, period.value),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3
            },
            {
              label: '본사 창고',
              data: alignDataByLabels(trendRes.headquarters, allLabels, period.value),
              borderColor: '#60a5fa',
              backgroundColor: 'rgba(147, 197, 253, 0.2)',
              fill: true,
              tension: 0.3
            },
            {
              label: '가맹점',
              data: alignDataByLabels(trendRes.franchises, allLabels, period.value),
              borderColor: '#facc15',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              fill: true,
              tension: 0.3
            }
          ]
        }
        : {
          labels: allLabels,
          datasets: [
            {
              label: trendRes[0]?.targetName ?? '선택 대상',
              data: trendRes.map(i => i.disposalRate),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3
            }
          ]
        }

    const productRes = await fetchDisposalRate(productParams)
    const productGrouped = {}
    for (const item of productRes) {
      const key = item.productName
      if (item.disposalRate > 0) {
        productGrouped[key] = (productGrouped[key] || 0) + item.disposalRate
      }
    }

    const productChartData = {
      labels: Object.keys(productGrouped),
      datasets: [
        {
          label: '폐기율 (%)',
          data: Object.values(productGrouped),
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1
        }
      ]
    }

    // ✅ 차트 제거 후 재렌더링
    shouldRenderChart.value = false
    await nextTick()
    shouldRenderChart.value = true
    isLoading.value = false // ✅ canvas가 v-if로 생성되도록 먼저 false 처리
    await nextTick()

    await waitForCanvasReady(['disposalTrendChart', 'disposalProductChart'])

    drawChart('disposalTrendChart', trendData, 'line', false, trendChartRef)
    drawChart('disposalProductChart', productChartData, 'bar', true, productChartRef)
  } catch (err) {
    console.error('❌ 폐기율 데이터 로드 실패:', err)
  } finally {
    isSearching.value = false
  }
}

function delayedSearch(newPeriod) {
  if (isSearching.value) return
  isSearching.value = true
  isLoading.value = true
  period.value = newPeriod

  setTimeout(() => {
    handleSearch().then(() => {
      isSearching.value = false
    })
  }, 500)
}

function drawChart(id, data, type = 'line', horizontal = false, refObj) {
  const canvas = document.getElementById(id)
  if (!canvas) {
    console.warn(`⛔️ ${id} 캔버스를 찾을 수 없습니다.`)
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (refObj.value && typeof refObj.value.destroy === 'function') {
    refObj.value.destroy()
  }

  const valueAxis = horizontal ? 'x' : 'y'
  const categoryAxis = horizontal ? 'y' : 'x'

  const allValues = data.datasets.flatMap(ds => ds.data)
  const rawMax = Math.max(...allValues)
  const suggestedMax = Math.ceil(rawMax * 1.2 * 10) / 10 || 1

  refObj.value = new Chart(ctx, {
    type,
    data,
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: ctx =>
                `${ctx.dataset.label}: ${ctx.parsed[horizontal ? 'x' : 'y'].toFixed(2)}%`
          }
        }
      },
      scales: {
        [valueAxis]: {
          beginAtZero: true,
          min: 0,
          max: suggestedMax,
          ticks: {
            callback: v => `${v.toFixed(1)}%`
          },
          grid: { color: '#f3f4f6' }
        },
        [categoryAxis]: {
          ticks: { autoSkip: false },
          grid: { color: '#f9fafb' }
        }
      }
    }
  })
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
    <!-- 📌 필터 영역 -->
    <div class="filter-box">
      <div class="filter-grid">
        <div class="filter-item">
          <label>조회 기간</label>
          <select v-model="period">
            <option value="DAILY">일간</option>
            <option value="WEEKLY">주간</option>
            <option value="MONTHLY">월간</option>
          </select>
        </div>

        <div class="filter-item">
          <label>위치</label>
          <select v-model="locationType">
            <option value="all">전체</option>
            <option value="warehouse">본사 창고</option>
            <option value="franchise">가맹점</option>
          </select>
        </div>

        <div class="filter-item">
          <label>선택</label>
          <select v-model="locationId" :disabled="locationType === 'all'">
            <option disabled value="">선택하세요</option>
            <option
                v-for="item in locationType === 'warehouse' ? warehouses : franchises"
                :key="item.id"
                :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="filter-item" v-if="locationType !== 'all'">
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
          <button class="btn-search" @click="handleSearch">조회</button>
        </div>
      </div>
    </div>

    <!-- 📊 차트 영역 -->
    <div class="chart-grid">
      <!-- 📈 폐기율 추이 -->
      <div class="chart-card col-8">
        <div class="chart-header">
          <h3>폐기율 추이</h3>
          <div class="tab-buttons">
            <button :class="{ active: period === 'DAILY' }" @click="() => delayedSearch('DAILY')">일간</button>
            <button :class="{ active: period === 'WEEKLY' }" @click="() => delayedSearch('WEEKLY')">주간</button>
            <button :class="{ active: period === 'MONTHLY' }" @click="() => delayedSearch('MONTHLY')">월간</button>
          </div>
        </div>

        <!-- ✅ 로딩 중 메시지 -->
        <div v-if="isLoading" class="chart-loading">📊 데이터 로딩 중...</div>

        <!-- ✅ 차트는 로딩이 끝난 뒤에만 표시 -->
        <canvas v-if="!isLoading && shouldRenderChart" id="disposalTrendChart"></canvas>
      </div>

      <!-- 📊 상품별 폐기율 -->
      <div class="chart-card col-4">
        <h3>상품별 폐기율</h3>
        <div v-if="isLoading" class="chart-loading">📦 데이터 로딩 중...</div>
        <canvas v-if="!isLoading && shouldRenderChart" id="disposalProductChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-loading {
  text-align: center;
  font-weight: bold;
  color: #888;
  padding: 1.5rem 0;
}
.dashboard {
  padding: 2rem;
  background-color: #f7f9fc;
  font-family: 'Noto Sans KR', sans-serif;
  position: relative;
}
.loading-overlay {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  color: #3b82f6;
  font-weight: bold;
  padding: 1rem;
  text-align: center;
  z-index: 10;
}
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
.disabled {
  background-color: #eee;
  color: #aaa;
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
.btn-search:hover {
  background-color: #2c91bc;
}
</style>
