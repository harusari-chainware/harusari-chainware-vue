<script setup>
import { ref } from 'vue'

// 필터 상태 관리
const filters = ref({
  drafter: '',
  code: '',
  status: '',
  date: '',
  vendor: ''
})

// 검색
const handleSearch = () => {
  alert('검색 기능이 실행되었습니다.')
}

// 초기화
const resetFilters = () => {
  filters.value = {
    drafter: '',
    code: '',
    status: '',
    date: '',
    vendor: ''
  }
}

// 새 품의서 작성
const goToCreate = () => {
  alert('새 품의서 작성 페이지로 이동합니다.')
}

// 현재 페이지 상태
const currentPage = ref(1)
const changePage = (page) => {
  currentPage.value = page
}
</script>

<template>
    <main class="requisition-list">
      <section class="page-header">
        <h1 class="page-title">품의서 목록</h1>
        <p class="page-description">모든 품의서 목록을 조회하고 관리할 수 있습니다.</p>
      </section>

      <section class="filters-section">
        <div class="filters-container">
          <div class="filter-group">
            <label class="filter-label">기안자</label>
            <input v-model="filters.drafter" type="text" class="filter-input" placeholder="기안자 이름 입력" />
          </div>
          <div class="filter-group">
            <label class="filter-label">품의 코드</label>
            <input v-model="filters.code" type="text" class="filter-input" placeholder="품의 코드 입력" />
          </div>
          <div class="filter-group">
            <label class="filter-label">품의 상태</label>
            <select v-model="filters.status" class="filter-select">
              <option value="">전체</option>
              <option value="pending">승인 대기중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">반려됨</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">품의 상신일</label>
            <input v-model="filters.date" type="date" class="filter-date" />
          </div>
          <div class="filter-group">
            <label class="filter-label">거래처명</label>
            <input v-model="filters.vendor" type="text" class="filter-input" placeholder="거래처명 입력" />
          </div>
        </div>
        <div class="filter-buttons">
          <button class="btn btn-secondary" @click="resetFilters">초기화</button>
          <button class="btn btn-primary" @click="handleSearch">검색</button>
        </div>
      </section>

      <div class="new-requisition-btn">
        <button class="btn btn-primary" @click="goToCreate">새 품의서 작성</button>
      </div>

      <section class="table-section">
        <div class="table-container">
          <table>
            <thead>
            <tr>
              <th>품의 코드</th>
              <th>거래처명</th>
              <th>기안자</th>
              <th>결재자</th>
              <th class="text-center">제품 수</th>
              <th class="text-right">총 수량</th>
              <th class="text-right">총 금액</th>
              <th>품의 상태</th>
              <th>상신일</th>
              <th>검토일</th>
              <th>상세</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>RQ-240815001</td>
              <td>테크솔루션 주식회사</td>
              <td>김철수</td>
              <td>박지영</td>
              <td class="text-center">3</td>
              <td class="text-right">225</td>
              <td class="text-right">7,375,000원</td>
              <td><span class="status-badge status-pending">승인 대기중</span></td>
              <td>2024-08-15</td>
              <td>-</td>
              <td><a href="#" class="detail-link">상세보기</a></td>
            </tr>
            <!-- TODO: API 연동 후 v-for로 반복 -->
            </tbody>
          </table>
        </div>

        <nav aria-label="페이지 네비게이션">
          <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#" @click.prevent="changePage(1)">1</a></li>
            <li class="page-item"><a class="page-link" href="#" @click.prevent="changePage(2)">2</a></li>
            <li class="page-item"><a class="page-link" href="#" @click.prevent="changePage(3)">3</a></li>
          </ul>
        </nav>
      </section>
    </main>
</template>

<style scoped>
.requisition-list {
  padding: 2rem;
  background-color: #f4f6f9;
}

.page-header {
  margin-bottom: 24px;
}
.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2d3d;
  margin-bottom: 8px;
  border-left: 4px solid #3aaed8;
  padding-left: 10px;
}
.page-description {
  font-size: 16px;
  color: #6b7280;
}

.filters-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.filter-group {
  flex: 1;
  min-width: 200px;
}
.filter-label {
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
}
.filter-input,
.filter-select,
.filter-date {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
.btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.btn-primary {
  background-color: #3aaed8;
  color: #fff;
}
.btn-primary:hover {
  background-color: #2c9cc3;
}
.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2d3d;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}

.new-requisition-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.table-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}
thead tr {
  background-color: #f4f6f9;
}
tbody tr:hover {
  background-color: #f9f9f9;
}

/* 공통 정렬 클래스 */
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* 상태 배지 스타일 */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  height: 28px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
}
.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}
.status-approved {
  background-color: #d1fae5;
  color: #065f46;
}
.status-rejected {
  background-color: #fee2e2;
  color: #b91c1c;
}

.detail-link {
  color: #3aaed8;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
}
.detail-link:hover {
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}
.page-item {
  list-style: none;
}
.page-link {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: #1f2d3d;
  transition: all 0.2s;
}
.page-link:hover {
  background-color: #f9f9f9;
}
</style>
