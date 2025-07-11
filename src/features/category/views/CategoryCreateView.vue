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
              />
            </div>
          </div>
        </div>
        <!-- 버튼: 카드 하단 가운데 -->
      </div>
    </template>
  </CategoryLayout>
  <div class="form-actions">
    <StatusButton type="primary" @click="handleSubmit">등록</StatusButton>
    <StatusButton type="default" @click="goBack">취소</StatusButton>
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

const handleSubmit = async () => {
  const isTopInput = !!topForm.value.topCategoryName;
  const isSubInput =
      !!subForm.value.topCategoryId &&
      !!subForm.value.categoryName &&
      !!subForm.value.categoryCode;

  // 둘 다 입력이 안된 경우
  if (!isTopInput && !isSubInput) {
    showError('상위 카테고리 또는 카테고리 정보를 입력하세요.');
    return;
  }
  // 하위카테고리 쪽에서 3개 모두 입력이 아닌 경우
  if (
      (subForm.value.topCategoryId || subForm.value.categoryName || subForm.value.categoryCode) &&
      !isSubInput
  ) {
    showError('카테고리 등록 시 상위 카테고리, 카테고리명, 카테고리 코드를 모두 입력하세요.');
    return;
  }

  try {
    let topRegistered = false;
    let subRegistered = false;
    // 상위 카테고리 등록
    if (isTopInput) {
      await createTopCategory(topForm.value);
      topRegistered = true;
    }
    // 하위 카테고리 등록
    if (isSubInput) {
      await createCategory(subForm.value);
      subRegistered = true;
    }
    if  (topRegistered) {
      doneModal.value = {show: true, type: 'register', isTop: true}; // 상위만
    } else if (subRegistered) {
      doneModal.value = {show: true, type: 'register', isTop: false}; // 하위만
    }
    // goBack()은 완료 모달 닫힐 때 실행 (아래 Tip 참고)
  } catch (e) {
    // Axios 에러 구조에 따라 response.data.message가 중복에 대한 안내라면 분기
    let msg = ''
    if (e.response && e.response.data && e.response.data.message) {
      msg = e.response.data.message
      if (e.response.status === 20001 || 21001) {
        showError('동일한 이름의 카테고리가 이미 존재합니다.')
        return
      }
      // 다른 서버 에러메시지도 바로 안내
      showError(msg)
      return
    }
    showError('등록 실패했습니다.')
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
</style>
