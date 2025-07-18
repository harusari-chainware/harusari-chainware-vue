<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchTakeBackDetail,
  approveTakeBackAPI,
  rejectTakeBackAPI,
  collectTakeBackAPI
} from '@/features/takeback/api.js'
import StatusButton from "@/components/common/StatusButton.vue"
import StatusBadge from "@/components/common/StatusBadge.vue"
import RejectReasonModal from "@/components/common/RejectReasonModal.vue"

const route = useRoute()
const takeBackId = route.params.id
const detail = ref(null)

const showRejectModal = ref(false) // ✅ 반려 모달 상태

const formatDate = (val) => val ? val.split('T')[0] : '-'
const formatAddress = (addr) => addr ? `${addr.addressRoad ?? '-'} ${addr.addressDetail ?? '-'} (${addr.zipcode ?? '-'})` : '-'

const fetchDetail = async () => {
  const { data } = await fetchTakeBackDetail(takeBackId)
  detail.value = data.data
}

const handleApprove = async () => {
  await approveTakeBackAPI(takeBackId)
  await fetchDetail()
}

const handleReject = () => {
  showRejectModal.value = true
}

const handleRejectConfirm = async (reason) => {
  await rejectTakeBackAPI(takeBackId, { rejectReason: reason })
  await fetchDetail()
}

const handleCollect = async () => {
  await collectTakeBackAPI(takeBackId)
  await fetchDetail()
}

onMounted(fetchDetail)
</script>

<template>
  <div class="takeback-detail-page">
    <div class="header-box">
      <h2 class="page-title">반품 상세 정보</h2>
      <div class="header-meta">
        <div class="left">
          <span class="code">
            반품 코드: <strong>{{ detail?.takeBackInfo?.takeBackCode }}</strong>
            <StatusBadge
                v-if="detail?.takeBackInfo?.takeBackStatus"
                :status="detail.takeBackInfo.takeBackStatus"
            />
          </span>
        </div>
        <div class="right" v-if="detail?.takeBackInfo?.takeBackStatus !== 'APPROVED'">
          <StatusButton type="approve" @click="handleApprove">승인</StatusButton>
          <StatusButton type="reject" @click="handleReject">반려</StatusButton>
          <StatusButton type="reset" @click="handleCollect">수거</StatusButton>
        </div>
      </div>
    </div>

    <!-- 정보 카드들 -->
    <div class="info-grid">
      <!-- 기본 정보 -->
      <div class="info-card">
        <h3 class="card-title">기본 정보</h3>
        <div class="info-grid-2col">
          <p><strong>반품 코드</strong> {{ detail?.takeBackInfo?.takeBackCode ?? '-' }}</p>
          <p><strong>반품 상태</strong> {{ detail?.takeBackInfo?.takeBackStatus ?? '-' }}</p>
          <p><strong>요청일</strong> {{ formatDate(detail?.takeBackInfo?.createdAt) }}</p>
          <p><strong>수정일</strong> {{ formatDate(detail?.takeBackInfo?.modifiedAt) }}</p>
          <p><strong>반려 사유</strong> {{ detail?.takeBackInfo?.rejectReason ?? '-' }}</p>
        </div>
      </div>

      <!-- 가맹점 정보 -->
      <div class="info-card">
        <h3 class="card-title">가맹점 정보</h3>
        <div class="info-grid-2col">
          <p><strong>가맹점명</strong> {{ detail?.franchiseInfo?.franchiseName ?? '-' }}</p>
          <p><strong>주소</strong> {{ formatAddress(detail?.franchiseInfo?.franchiseAddress) }}</p>
          <p><strong>사업자 등록번호</strong> {{ detail?.franchiseInfo?.franchiseTaxId ?? '-' }}</p>
          <p><strong>가맹점 상태</strong> {{ detail?.franchiseInfo?.franchiseStatus ?? '-' }}</p>
          <p><strong>대표자명</strong> {{ detail?.franchiseInfo?.ownerName ?? '-' }}</p>
          <p><strong>대표자 연락처</strong> {{ detail?.franchiseInfo?.ownerPhoneNumber ?? '-' }}</p>
          <p><strong>가맹점 연락처</strong> {{ detail?.franchiseInfo?.franchisePhoneNumber ?? '-' }}</p>
        </div>
      </div>

      <!-- 창고 정보 -->
      <div class="info-card">
        <h3 class="card-title">창고 정보</h3>
        <div class="info-grid-2col">
          <p><strong>창고명</strong> {{ detail?.warehouseInfo?.warehouseName ?? '-' }}</p>
          <p><strong>창고 주소</strong> {{ formatAddress(detail?.warehouseInfo?.warehouseAddress) }}</p>
          <p><strong>창고 담당자</strong> {{ detail?.warehouseInfo?.warehouseManagerName ?? '-' }}</p>
        </div>
      </div>

      <!-- 주문 정보 -->
      <div class="info-card">
        <h3 class="card-title">주문 정보</h3>
        <div class="info-grid-2col">
          <p><strong>주문 코드</strong> {{ detail?.orderInfo?.orderCode ?? '-' }}</p>
          <p><strong>제품 종류 수</strong> {{ detail?.orderInfo?.productCount ?? '-' }}종</p>
          <p><strong>총 수량</strong> {{ detail?.orderInfo?.totalQuantity ?? '-' }}개</p>
          <p><strong>총 금액</strong> {{ detail?.orderInfo?.totalPrice?.toLocaleString() ?? '-' }}원</p>
        </div>
      </div>
    </div>

    <!-- 반품 제품 정보 -->
    <div class="info-card">
      <h3 class="card-title">반품 제품 정보</h3>
      <div class="product-table">
        <table>
          <thead>
          <tr>
            <th>제품 ID</th>
            <th>제품 코드</th>
            <th>제품명</th>
            <th>단위</th>
            <th>수량</th>
            <th>가격</th>
            <th>반품 사유</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in detail?.productInfos" :key="item.productId">
            <td>{{ item.productId }}</td>
            <td>{{ item.productCode }}</td>
            <td>{{ item.productName }}</td>
            <td>{{ item.unitSpec }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price?.toLocaleString() }}원</td>
            <td>{{ item.takeBackReason }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 증빙 자료 -->
    <h3 class="card-title">증빙 자료</h3>
    <div>
      <img
          v-for="item in detail?.productInfos"
          :src="item.takeBackImage"
          alt="반품 이미지"
          class="evidence-image"
      />
    </div>

    <!-- ✅ 반려 모달 -->
    <RejectReasonModal
        v-model="showRejectModal"
        title="반려 사유 입력"
        @confirm="handleRejectConfirm"
    />
  </div>
</template>

<style scoped>
.takeback-detail-page {
  padding: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  border-left: 4px solid rgb(58, 174, 216);
  padding-left: 10px;
  margin-bottom: 0.5rem;
}

.header-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.code-button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.approve {
  background-color: #4caf50;
  color: white;
}
.reject {
  background-color: #f44336;
  color: white;
}
.cancel {
  background-color: #e0e0e0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
  border-left: 4px solid rgb(58, 174, 216);
}

.info-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  row-gap: 0.75rem;
}

.product-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
}

.image-section {
  margin-top: 1.5rem;
}
.evidence-image {
  width: 200px;
  height: auto;
  border: 1px solid #ddd;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}
/* 카드 내부 key-value 정렬 개선 */
.info-grid-2col p {
  display: flex;
  flex-wrap: wrap; /* ✅ 자동 줄바꿈 허용 */
  gap: 0.25rem 0.5rem;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
  word-break: keep-all; /* ✅ 단어 중간 끊김 방지 */
}
.info-grid-2col p strong {
  display: inline-block;
  min-width: 80px; /* ✅ 가변 너비 확대 */
  color: #111827;
  font-weight: 600;
  white-space: nowrap;
}
.product-table {
  margin-top: 2rem;
}

.product-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  border-spacing: 0;
}

/* 헤더 스타일 */
.product-table thead tr {
  background-color: #f1f5f9; /* 연한 회색 배경 */
}

.product-table th {
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

/* 본문 셀 스타일 */
.product-table td {
  padding: 0.65rem;
  font-size: 0.9rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

/* 세로선 제거 */
.product-table th,
.product-table td {
  border-left: none;
  border-right: none;
}

/* 첫/마지막 셀에서 좌우 여백 추가 */
.product-table th:first-child,
.product-table td:first-child {
  padding-left: 1rem;
}
.product-table th:last-child,
.product-table td:last-child {
  padding-right: 1rem;
}

/* 이미지 스타일 */
.image-section {
  margin-top: 1.5rem;
}
.evidence-image {
  width: 200px;
  height: auto;
  border: 1px solid #ddd;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}
.header-box {
  margin-bottom: 1.5rem;
}

.header-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header-meta .left {
  font-size: 1rem;
  color: #374151;
}

.header-meta .code strong {
  font-weight: 600;
  color: #111827;
}

.header-meta .right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.header-meta .code {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.header-meta .code strong {
  font-weight: 600;
  color: #111827;
}
</style>
