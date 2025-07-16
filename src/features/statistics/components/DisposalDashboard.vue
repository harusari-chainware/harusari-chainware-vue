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

const period = ref('DAILY')
const locationType = ref('all')
const locationId = ref('')
const targetDate = ref(new Date(Date.now() - 86400000).toISOString().split('T')[0])
const warehouses = ref([])
const franchises = ref([])
const searchKeyword = ref('')
const isLoading = ref(false)
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

async function handleSearch() {
  try {
    isLoading.value = true
    shouldRenderChart.value = false
    await nextTick()

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

    const trendData = locationType.value === 'all'
        ? {
          labels: formatXAxisLabels(trendRes.total.map(i => i.date), period.value),
          datasets: [
            {
              label: '전체',
              data: trendRes.total.map(i => i.disposalRate),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3
            },
            {
              label: '본사 창고',
              data: trendRes.headquarters.map(i => i.disposalRate),
              borderColor: '#60a5fa',
              backgroundColor: 'rgba(147, 197, 253, 0.2)',
              fill: true,
              tension: 0.3
            },
            {
              label: '가맹점',
              data: trendRes.franchises.map(i => i.disposalRate),
              borderColor: '#facc15',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              fill: true,
              tension: 0.3
            }
          ]
        }
        : {
          labels: formatXAxisLabels(trendRes.map(i => i.date), period.value),
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

    await nextTick()
    shouldRenderChart.value = true
    await nextTick()

    setTimeout(() => {
      drawChart('disposalTrendChart', trendData, 'line', false, trendChartRef)
    }, 0)

    const productRes = await fetchDisposalRate(productParams)

    const productGrouped = {}
    for (const item of productRes) {
      const key =
          period.value === 'MONTHLY'
              ? `${new Date(item.date).getMonth() + 1}월`
              : period.value === 'WEEKLY'
                  ? `${new Date(item.date).getMonth() + 1}월 ${Math.ceil(new Date(item.date).getDate() / 7)}주차`
                  : item.date
      productGrouped[item.productName] = (productGrouped[item.productName] || 0) + item.disposalRate
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

    setTimeout(() => {
      drawChart('disposalProductChart', productChartData, 'bar', true, productChartRef)
    }, 0)
  } catch (err) {
    console.error(' 폐기율 데이터 로드 실패:', err)
  } finally {
    isLoading.value = false
  }
}

function delayedSearch(newPeriod) {
  isLoading.value = true
  period.value = newPeriod
  setTimeout(() => handleSearch(), 1000)
}

function drawChart(id, data, type = 'line', horizontal = false, refObj) {
  const canvas = document.getElementById(id)
  if (!canvas) {
    console.warn(`⚠️ Canvas element not found: #${id}`)
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.warn(`⚠️ Canvas context not available for: #${id}`)
    return
  }

  if (refObj.value && typeof refObj.value.destroy === 'function') refObj.value.destroy()

  const valueAxis = horizontal ? 'x' : 'y'
  const categoryAxis = horizontal ? 'y' : 'x'

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
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed[horizontal ? 'x' : 'y']}%`
          }
        }
      },
      scales: {
        [valueAxis]: {
          beginAtZero: true,
          ticks: { callback: v => `${v}%` },
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
            <option v-for="item in locationType === 'warehouse' ? warehouses : franchises" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="filter-item" v-if="locationType !== 'all'">
          <label>검색</label>
          <input v-model="searchKeyword" placeholder="이름으로 검색" @input="handleSearchKeyword" />
        </div>
        <div class="form-group">
          <FilterDate label="기준일" v-model="targetDate" />
        </div>
        <div class="filter-item">
          <label style="visibility: hidden">조회</label>
          <button class="btn-search" @click="handleSearch">조회</button>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-card col-8">
        <div class="chart-header">
          <h3>폐기율 추이</h3>
          <div class="tab-buttons">
            <button :class="{ active: period === 'DAILY' }" @click="() => delayedSearch('DAILY')">일간</button>
            <button :class="{ active: period === 'WEEKLY' }" @click="() => delayedSearch('WEEKLY')">주간</button>
            <button :class="{ active: period === 'MONTHLY' }" @click="() => delayedSearch('MONTHLY')">월간</button>
          </div>
        </div>
        <canvas v-if="shouldRenderChart" id="disposalTrendChart"></canvas>
      </div>
      <div class="chart-card col-4">
        <h3>상품별 폐기율</h3>
        <canvas v-if="shouldRenderChart" id="disposalProductChart"></canvas>
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
</style>
