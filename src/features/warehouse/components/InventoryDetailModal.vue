<script setup>
defineProps({ show: Boolean, data: Object })

const formatDate = (str) => {
  if (!str) return '-'
  const d = new Date(str)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h3>재고 상세 정보</h3>
        <button class="close-icon" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <!-- 창고 정보 -->
        <section class="info-table">
          <h4>창고 정보</h4>
          <table class="plain-table">
            <tr>
              <th>창고명</th><td>{{ data.warehouse?.name || '-' }}</td>
              <th>연락처</th><td>{{ data.warehouse?.contact || '-' }}</td>
            </tr>
            <tr>
              <th>주소</th><td colspan="3">{{ data.warehouse?.address || '-' }}</td>
            </tr>
          </table>
          <hr class="section-divider" />
        </section>

        <!-- 제품 정보 -->
        <section class="info-table">
          <h4>제품 정보</h4>
          <table class="plain-table">
            <tr><th>제품명</th><td>{{ data.product?.name || '-' }}</td><th>제품 코드</th><td>{{ data.product?.code || '-' }}</td></tr>
            <tr><th>카테고리</th><td>{{ data.product?.category || '-' }}</td><th>단위</th><td>{{ data.product?.unit || '-' }}</td></tr>
          </table>
          <hr class="section-divider" />
        </section>

        <!-- 재고 정보 -->
        <section class="info-table">
          <h4>재고 정보</h4>
          <table class="plain-table">
            <tr>
              <th>현재 수량</th>
              <td>{{ data.inventory?.quantity ?? '-' }}</td>
              <th>예약 수량</th>
              <td>{{ data.inventory?.reservedQuantity ?? '-' }}</td>
            </tr>
            <tr>
              <th>가용 수량</th>
              <td>{{ (data.inventory?.quantity ?? 0) - (data.inventory?.reservedQuantity ?? 0) }}</td>
              <th>안전 재고</th>
              <td>{{ data.inventory?.safetyQuantity ?? '-' }}</td>
            </tr>
          </table>
          <hr class="section-divider" />
        </section>

        <!-- 입고 내역 -->
        <section class="info-table">
          <h4>최근 입고 내역</h4>
          <table>
            <thead>
            <tr><th>입고일</th><th>수량</th><th>담당자</th><th>발주 코드</th></tr>
            </thead>
            <tbody v-if="data.recentInbounds?.length">
            <tr v-for="(item, idx) in data.recentInbounds" :key="'in-' + idx">
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.quantity }} {{ data.product?.unit || '' }}</td>
              <td>{{ item.manager }}</td>
              <td>{{ item.note || '-' }}</td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="4" class="empty-row">입고 내역이 없습니다.</td>
            </tr>
            </tbody>
          </table>
        </section>

        <!-- 출고 내역 -->
        <section class="info-table">
          <h4>최근 출고 내역</h4>
          <table>
            <thead>
            <tr><th>출고일</th><th>수량</th><th>담당자</th><th>출고처</th></tr>
            </thead>
            <tbody v-if="data.recentOutbounds?.length">
            <tr v-for="(item, idx) in data.recentOutbounds" :key="'out-' + idx">
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.quantity }} {{ data.product?.unit || '' }}</td>
              <td>{{ item.manager }}</td>
              <td>{{ item.destination }}</td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="4" class="empty-row">출고 내역이 없습니다.</td>
            </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div class="modal-footer">
        <button class="close-button" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

.close-icon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: #000;
}

.modal-body {
  margin-top: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.close-button {
  padding: 6px 12px;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.info-table {
  margin-bottom: 1.5rem;
}

.info-table h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.section-divider {
  margin-top: 1rem;
  border: none;
  border-top: 1px solid #ddd;
}

.plain-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.plain-table th {
  width: 15%;
  font-weight: 500;
  text-align: left;
  padding: 6px 4px;
  color: #555;
  background: none;
  border: none;
}

.plain-table td {
  width: 35%;
  padding: 6px 4px;
  background: none;
  border: none;
  color: #222;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 0.5rem;
}

/* ✅ 모든 테이블 셀 수직선 제거 */
table th,
table td {
  border-left: none !important;
  border-right: none !important;
}

/* ✅ 셀 기본 스타일 유지 (위/아래 선은 유지) */
table th,
table td {
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
  line-height: 1.6;
}

/* ✅ 헤더 배경과 폰트 강조 */
table th {
  background-color: #f9f9f9;
  font-weight: 500;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

/* ✅ 테이블 행의 가로선만 유지 */
table tbody tr td {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

/* ✅ 빈 데이터 메시지 스타일 */
.empty-row {
  text-align: center;
  padding: 12px;
  color: #666;
  font-style: italic;
  background-color: #fff;
  line-height: 1.6;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
</style>
