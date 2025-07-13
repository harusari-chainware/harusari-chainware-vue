<template>
  <CategoryLayout
      title="상위 카테고리/카테고리 등록"
      description="상위 카테고리와 카테고리를 한 번에 등록할 수 있습니다."
  >
    <template #basic>
      <div class="category-register-card">
        <div class="form-grid">
          <!-- 좌: 상위 카테고리 등록 폼 -->
          <div class="form-col">
            <h3 class="form-title">상위 카테고리 등록</h3>
            <div class="form-row">
              <label>상위 카테고리명</label>
              <input
                  v-model="topForm.topCategoryName"
                  class="input"
                  placeholder="상위 카테고리명을 입력하세요"
                  maxlength="20"
              />
            </div>
          </div>
          <!-- 우: 카테고리 등록 폼 -->
          <div class="form-col">
            <h3 class="form-title">카테고리 등록</h3>
            <div class="form-row">
              <label>상위 카테고리</label>
              <select v-model="subForm.topCategoryId" class="input">
                <option value="">상위 카테고리를 선택하세요</option>
                <option v-for="cat in topCategories" :key="cat.topCategoryId" :value="cat.topCategoryId">
                  {{ cat.topCategoryName }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <label>카테고리명</label>
              <input
                  v-model="subForm.categoryName"
                  class="input"
                  maxlength="20"
                  placeholder="카테고리명을 입력하세요"
              />
            </div>
            <div class="form-row">
              <label>카테고리 코드</label>
              <input
                  v-model="subForm.categoryCode"
                  class="input"
                  maxlength="2"
                  placeholder="2자리 코드(영문 대문자)"
                  @input="onCodeInput"
              />
            </div>
          </div>
        </div>
        <!-- 버튼: 카드 하단 가운데 -->
      </div>
    </template>
  </CategoryLayout>
  <div class="form-actions">
    <button
        type="button"
        class="status-btn primary"
        @click="handleSubmit"
    >
      등록
    </button>
    <button
        type="button"
        class="status-btn"
        @click="goBack"
    >
      취소
    </button>
  </div>

  <!-- 등록/수정 모달 -->
  <CategoryDoneModal
      v-if="doneModal.show"
      :type="doneModal.type"
      :is-top="doneModal.isTop"
      @close="doneModal.show = false"
  />

  <div>
    <CategoryErrorModal
        v-if="ErrorOpen"
        :message="ErrorMsg"
        @close="ErrorOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllListTopCategories, createTopCategory, createCategory } from '@/features/category/api.js'
import CategoryLayout from "@/features/category/components/CategoryLayout.vue";
import StatusButton from "@/components/common/StatusButton.vue";
import CategoryModal from "@/features/category/components/CategoryModal.vue";
import CategoryErrorModal from "@/features/category/components/CategoryErrorModal.vue";
import CategoryDoneModal from "@/features/category/components/CategoryDoneModal.vue";

const router = useRouter()
const topCategories = ref([])

const topForm = ref({
  topCategoryName: ''
})
const subForm = ref({
  topCategoryId: '',
  categoryName: '',
  categoryCode: ''
})

const ErrorOpen = ref(false)
const ErrorMsg = ref('')
function showError(msg) {
  ErrorMsg.value = msg
  ErrorOpen.value = true
}

// 등록/수정 완료 모달 상태 (아래에서 사용할 수도 있음)
const doneModal = ref({
  show: false,
  type: 'edit',    // 'register' | 'edit'
  isTop: false
})

const loadTopCategories = async () => {
  const res = await fetchAllListTopCategories()
  topCategories.value = res.data?.data ?? []
}
onMounted(loadTopCategories)

const onCodeInput = (e) => {
  subForm.value.categoryCode = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0,2)
}

const handleSubmit = async () => {
  // 상위 카테고리 입력 여부
  const isTopInput = !!topForm.value.topCategoryName;
  // 하위 카테고리 필드별 입력 여부
  const isTopCategorySelected = !!subForm.value.topCategoryId;
  const isSubNameInput = !!subForm.value.categoryName;
  const isSubCodeInput = !!subForm.value.categoryCode;

  // 1. 전체 아무것도 입력 안 했을 때
  if (!isTopInput && !isTopCategorySelected && !isSubNameInput && !isSubCodeInput) {
    showError('상위 카테고리를 입력해주세요.');
    return;
  }

  // 2. 하위 카테고리 등록(카테고리) 필드별 체크
  if (isTopCategorySelected && (!isSubNameInput || !isSubCodeInput)) {
    if (!isSubNameInput) {
      showError('카테고리명을 입력해주세요.');
      return;
    }
    if  (isSubCodeInput || !/^[A-Z]{2}$/.test(subForm.value.categoryCode)) {
      showError('카테고리 코드는 대문자 2자리로 입력해주세요. (예: CF)');
      return;
    }
  }

  // 3. 카테고리명만 입력돼있고 상위 카테고리 미선택시
  if (!isTopCategorySelected && (isSubNameInput || isSubCodeInput)) {
    showError('상위 카테고리를 선택해주세요.');
    return;
  }

  // 4. 정상 입력일 때 등록 진행
  try {
    let topRegistered = false;
    let subRegistered = false;

    // 상위 카테고리 등록
    if (isTopInput) {
      await createTopCategory(topForm.value);
      topRegistered = true;
    }
    // 하위 카테고리 등록
    if (isTopCategorySelected && isSubNameInput && isSubCodeInput) {
      await createCategory(subForm.value);
      subRegistered = true;
    }
    if  (topRegistered) {
      doneModal.value = {show: true, type: 'register', isTop: true};
    } else if (subRegistered) {
      doneModal.value = {show: true, type: 'register', isTop: false};
    }
    // goBack()은 완료 모달 닫힐 때 실행
  } catch (e) {
    let msg = ''
    if (e.response && e.response.data && e.response.data.message) {
      msg = e.response.data.message
      if (e.response.status === 20001 || 21001) {
        showError('동일한 이름의 카테고리가 이미 존재합니다.');
        return;
      }
      showError(msg);
      return;
    }
    showError('등록 실패했습니다.');
  }
}


const goBack = () => {
  router.push('/category/list')
}
</script>

<style scoped>
.form-grid {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: 10rem;
}
.form-col {
  flex: 1;
  min-width: 320px;
}
.form-title {
  font-size: var(--font-page-title-small);
  font-weight: bold;
  color: var(--color-gray-700);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.75rem;
  margin-bottom: 3rem;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.form-row label {
  flex: 0 0 130px;
  font-weight: 500;
  margin-right: 12px;
  color: #2b2b2b;
}
.input {
  padding: 0.5rem 0.75rem;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-info-value);
  color: var(--color-gray-900);
  min-height: 2.2rem;
  display: flex;
  align-items: center;
}
.form-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
}
@media (max-width: 900px) {
  .form-grid { flex-direction: column; gap: 24px;}
  .form-actions { margin-top: 24px;}
}

.status-btn {
  padding: 6px 16px;
  font-size: var(--font-button);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
}
.status-btn.primary {
  background: var(--color-primary);
  color: #fff;
}
.status-btn.primary:hover {
  background: var(--color-primary);
}

</style>
