<script setup>
import { ref } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import RejectReasonDialog from '@/components/common/RejectReasonDialog.vue'


// 더미 데이터 (향후 API 연동시 대체 예정)
const requisition = ref({
  type: '발주',
  code: 'RQ-240815001',
  status: 'PENDING', // 'APPROVED', 'REJECTED'
  purchaseCode: 'PO-240815001',
  dueDate: '-',
  submittedAt: '2024-08-15 09:30:45',
  approvedAt: '-',
  writer: {
    name: '김철수',
    position: '구매 담당자',
    email: 'chulsoo.kim@company.com'
  },
  approver: {
    name: '박지영',
    position: '구매팀장',
    email: 'jiyoung.park@company.com'
  },
  vendor: {
    name: '(주)원두',
    type: '공급업체',
    manager: '아무개',
    contact: '010-1234-5678'
  },
  products: [
    { no: 1, name: '우유(멸균)', code: 'PD-BE-004', price: 50000, moq: 10, quantity: 50 },
    { no: 2, name: '냉동 브라우니 완제품', code: 'PD-BE-001', price: 30000, moq: 20, quantity: 100 },
    { no: 3, name: '에티오피아 원두 2kg', code: 'PD-BE-003', price: 25000, moq: 15, quantity: 75 }
  ]
})

const getTotalAmount = () =>
    requisition.value.products.reduce((sum, item) => sum + item.price * item.quantity, 0)

const formatCurrency = (value) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'APPROVED': return 'status-approved'
    case 'REJECTED': return 'status-rejected'
    default: return 'status-pending'
  }
}

const approve = () => {
  // TODO: API 연동 예정
  console.log('승인')
}
const reject = () => {
  // TODO: API 연동 예정
  console.log('반려')
}

const showConfirm = ref(false)

const handleApproveClick = () => {
  showConfirm.value = true
}

const handleConfirm = () => {
  showConfirm.value = false
  // 승인 처리 로직 실행
}

const handleCancel = () => {
  showConfirm.value = false
}

const showRejectModal = ref(false)


// 반려 요청 처리 함수
const handleRejectSubmit = (reason) => {
  console.log('반려 사유:', reason)

  // TODO: API 호출 로직 (예: axios.post('/api/requisitions/{id}/reject', { reason }))
  // 예외 처리, 로딩 처리 등도 여기서 가능

  showRejectModal.value = false
}
// 반려 버튼 클릭
const rejectRequisition = () => {
  showRejectModal.value = true
}



</script>

<template>
  <div class="requisition-detail">
    <div class="page-header">
      <h1 class="page-title">품의서 상세</h1>
      <div class="button-group">
        <button class="btn btn-primary" @click="handleApproveClick">승인</button>
        <button class="btn btn-outline" @click="rejectRequisition">반려</button>
      </div>
    </div>

    <section class="grid grid-2">
      <article class="section">
        <h2 class="section-title">기본 정보</h2>
        <dl class="info-grid">
          <dt class="info-label">품의 종류</dt>
          <dd class="info-value">{{ requisition.type }}</dd>

          <dt class="info-label">품의 코드</dt>
          <dd class="info-value">{{ requisition.code }}</dd>

          <dt class="info-label">품의 상태</dt>
          <dd class="info-value">
            <span class="status-badge" :class="getStatusBadgeClass(requisition.status)">
              {{ requisition.status === 'APPROVED' ? '승인 완료' : requisition.status === 'REJECTED' ? '반려됨' : '승인 대기중' }}
            </span>
          </dd>

          <dt class="info-label">관련 발주 코드</dt>
          <dd class="info-value">{{ requisition.purchaseCode }}</dd>

          <dt class="info-label">납기일</dt>
          <dd class="info-value">{{ requisition.dueDate }}</dd>
        </dl>
      </article>

      <article class="section">
        <h2 class="section-title">일시 정보</h2>
        <dl class="info-grid">
          <dt class="info-label">상신 일시</dt>
          <dd class="info-value">{{ requisition.submittedAt }}</dd>

          <dt class="info-label">승인/반려 일시</dt>
          <dd class="info-value">{{ requisition.approvedAt }}</dd>
        </dl>
      </article>
    </section>

    <section class="grid grid-2">
      <article class="section">
        <h2 class="section-title">작성자 정보</h2>
        <dl class="info-grid">
          <dt class="info-label">이름</dt>
          <dd class="info-value">{{ requisition.writer.name }}</dd>

          <dt class="info-label">직책</dt>
          <dd class="info-value">{{ requisition.writer.position }}</dd>

          <dt class="info-label">이메일</dt>
          <dd class="info-value">{{ requisition.writer.email }}</dd>
        </dl>
      </article>

      <article class="section">
        <h2 class="section-title">결재자 정보</h2>
        <dl class="info-grid">
          <dt class="info-label">이름</dt>
          <dd class="info-value">{{ requisition.approver.name }}</dd>

          <dt class="info-label">직책</dt>
          <dd class="info-value">{{ requisition.approver.position }}</dd>

          <dt class="info-label">이메일</dt>
          <dd class="info-value">{{ requisition.approver.email }}</dd>
        </dl>
      </article>
    </section>

    <section class="grid grid-2">
      <article class="section">
        <h2 class="section-title">거래처 정보</h2>
        <dl class="info-grid">
          <dt class="info-label">거래처명</dt>
          <dd class="info-value">{{ requisition.vendor.name }}</dd>

          <dt class="info-label">유형</dt>
          <dd class="info-value">{{ requisition.vendor.type }}</dd>

          <dt class="info-label">담당자</dt>
          <dd class="info-value">{{ requisition.vendor.manager }}</dd>

          <dt class="info-label">연락처</dt>
          <dd class="info-value">{{ requisition.vendor.contact }}</dd>
        </dl>
      </article>

      <article class="section">
        <h2 class="section-title">창고 정보</h2>
        <dl class="info-grid">
          <dt class="info-label">창고명 </dt>
          <dd class="info-value">{{ requisition.submittedAt }}</dd>

          <dt class="info-label">담당자</dt>
          <dd class="info-value">{{ requisition.approvedAt }}</dd>
        </dl>
      </article>
    </section>

    <section class="section">
      <h2 class="section-title">품의 상세 품목</h2>
      <div class="table-container">
        <table>
          <thead>
          <tr>
            <th>No</th>
            <th>제품명</th>
            <th>제품 코드</th>
            <th>계약 단가</th>
            <th>MOQ</th>
            <th>총 수량</th>
            <th>총 금액</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in requisition.products" :key="item.no">
            <td>{{ item.no }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.code }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ item.moq }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.price * item.quantity) }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td colspan="6" style="text-align: right;">총계</td>
            <td>{{ formatCurrency(getTotalAmount()) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>

  <ConfirmDialog
      :visible="showConfirm"
      title="승인 확인"
      message="해당 품의를 승인하시겠습니까?"
      confirmText="승인"
      cancelText="취소"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  />
  <RejectReasonDialog
      :visible="showRejectModal"
      @submit="handleRejectSubmit"
      @cancel="() => (showRejectModal = false)"
  />
</template>

<style scoped>
.requisition-detail {
  padding: 2rem;
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2d3d;
  border-left: 4px solid #3aaed8;
  padding-left: 10px;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  border-left: 4px solid #3aaed8;
  padding-left: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px 16px;
}

.info-label {
  color: #4b5563;
  font-weight: 500;
}

.info-value {
  color: #1f2937;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
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

.grid {
  display: grid;
  gap: 20px;
}
.grid-2 {
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px 15px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
thead tr {
  background-color: #f3f4f6;
}
tfoot tr {
  background-color: #f9fafb;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background-color: #3aaed8;
  color: white;
  border: none;
}
.btn-primary:hover {
  background-color: #2c91bc;
}
.btn-outline {
  background-color: white;
  color: #ef4444;
  border: 1px solid #ef4444;
}
.btn-outline:hover {
  background-color: #fef2f2;
}
</style>
