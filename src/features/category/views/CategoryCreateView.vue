<template>
  <ListLayout
      title="상위 카테고리/카테고리 등록"
      description="상위 카테고리 또는 카테고리를 등록할 수 있습니다."
  >
    <!-- 전환 버튼 -->
    <template #top-actions-left>
    <div class="tab-buttons">
      <button
          :class="{ active: formType === 'top' }"
          @click="formType = 'top'"
      >
        상위 카테고리 등록
      </button>
      <button
          :class="{ active: formType === 'sub' }"
          @click="formType = 'sub'"
      >
        카테고리 등록
      </button>
    </div>
    </template>

    <!-- 폼 영역 -->
    <template v-if="formType" #table>
      <CategoryForm

          :form-type="formType"
          :is-top="formType === 'top'"
          :is-modal="false"
          :top-categories="topCategories"
          @submitted="handleSuccess"
          @cancelled="goBack"
      />
    </template>
  </ListLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ListLayout from '@/components/layout/ListLayout.vue'
import CategoryForm from '../components/CategoryForm.vue'
import { fetchAllTopCategories } from '@/api/categoryApi'

const router = useRouter()
const formType = ref('top') // 기본값: 상위 카테고리
const topCategories = ref([])

const goBack = () => {
  router.push('/category/list')
}

const handleSuccess = () => {
  alert('카테고리가 성공적으로 등록되었습니다.')
  goBack()
}

const loadTopCategories = async () => {
  const res = await fetchAllTopCategories()
  console.log('topCategories 응답:', res.data?.data)
  topCategories.value = res.data?.data?.topCategories ?? []
}

onMounted(() => {
  console.log('formType:', formType.value)
  loadTopCategories()
})
</script>

<style scoped>
.tab-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-buttons button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
}

.tab-buttons button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
