<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import FilterDate from "@/components/common/filters/FilterDate.vue"
import { fetchMenuSales, fetchTotalSales, fetchAllFranchises } from '@/features/statistics/api.js'

const periodType = ref('DAILY')
const franchiseId = ref('')
const targetDate = ref(new Date(Date.now() - 86400000).toISOString().split('T')[0])

const totalQuantity = ref(0)
const totalSalesAmount = ref(0)
const changeRate = ref(0)
const bestSeller = ref(null)

const franchises = ref([])
const franchiseList = ref([])
const searchKeyword = ref('')

const salesChart = ref(null)
const revenueChart = ref(null)

const shouldRenderChart = ref(true)
const isLoading = ref(false)

function handleSearchKeyword() {
  const match = franchises.value.find(i => i.name.includes(searchKeyword.value))
  franchiseId.value = match ? match.id : ''
}

async function loadData() {
  isLoading.value = true
  try {
    const menuData = await fetchMenuSales({
      periodType: periodType.value,
      franchiseId: franchiseId.value,
      targetDate: targetDate.value
    })

    const totalData = await fetchTotalSales({
      period: periodType.value,
      franchiseId: franchiseId.value,
      targetDate: targetDate.value
    })

    totalQuantity.value = menuData.reduce((sum, m) => sum + m.totalQuantity, 0)
    totalSalesAmount.value = totalData.totalSalesAmount
    changeRate.value = totalData.changeRate
    bestSeller.value = menuData[0]

    await updateCharts(menuData)
  } finally {
    isLoading.value = false
  }
}

async function updateCharts(data) {
  shouldRenderChart.value = false
  await nextTick() // canvas 제거 대기

  shouldRenderChart.value = true
  await nextTick() // canvas 재생성 대기

  const labels = data.map(d => d.menuName)
  const quantities = data.map(d => d.totalQuantity)
  const revenues = data.map(d => d.totalAmount)

  const ctx1 = document.getElementById('salesChart')
  const ctx2 = document.getElementById('revenueChart')

  if (!ctx1 || !ctx2) return

  if (salesChart.value) salesChart.value.destroy()
  if (revenueChart.value) revenueChart.value.destroy()

  salesChart.value = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: '판매량', data: quantities, backgroundColor: '#8580ef' }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: { label: ctx => `${ctx.parsed.y}개` }
        }
      },
      scales: { y: { beginAtZero: true } }
    }
  })

  revenueChart.value = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: '매출액', data: revenues, backgroundColor: '#6DACD3' }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: { label: ctx => `₩${ctx.parsed.y.toLocaleString()}` }
        }
      },
      scales: { y: { beginAtZero: true } }
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
  <div class="menu-sales-dashboard">
    <!-- 로딩 오버레이 -->
    <div v-if="isLoading" class="loading-overlay">
      <p>데이터 로딩중...</p>
    </div>

    <!-- 필터 영역 -->
    <div class="filter-box">
      <div class="filter-grid">
        <div class="form-group">
          <label>조회 주기</label>
          <select v-model="periodType">
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
    <div class="summary-section">
      <div class="card">
        <p>총 판매량</p>
        <h2>{{ totalQuantity }}개</h2>
      </div>
      <div class="card">
        <p>총 매출액</p>
        <h2>₩{{ totalSalesAmount.toLocaleString() }}</h2>
        <span :class="changeRate >= 0 ? 'trend-up' : 'trend-down'">
          {{ changeRate >= 0 ? '+' : '' }}{{ changeRate }}%
        </span>
      </div>
      <div class="card">
        <p>베스트셀러</p>
        <h2>{{ bestSeller?.menuName || '-' }}</h2>
        <small>{{ bestSeller?.totalQuantity?.toLocaleString() || '-' }}개 ({{ bestSeller?.salesRatio?.toFixed(1) || '-' }}%)</small>
      </div>
    </div>

    <!-- 차트 영역 -->
    <div class="charts">
      <div class="chart-card">
        <h3>메뉴별 판매량</h3>
        <canvas v-if="shouldRenderChart" id="salesChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>메뉴별 매출액</h3>
        <canvas v-if="shouldRenderChart" id="revenueChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-sales-dashboard {
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
}
button.primary {
  background-color: rgb(58, 174, 216);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 100%;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
.summary-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.card {
  flex: 1;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
}
.card h2 {
  font-size: 20px;
  margin: 10px 0;
}
.trend-up {
  color: #10b981;
  font-weight: bold;
}
.trend-down {
  color: #ef4444;
  font-weight: bold;
}
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.chart-card {
  flex: 1;
  min-width: 400px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}
.primary:hover {
  background-color: #2c91bc;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #4b5563;
  z-index: 999;
}

</style>
