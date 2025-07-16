<template>
  <div class="filters-container">

    <!-- 상위 카테고리명 드롭다운 -->
    <FilterSelect
        label="상위 카테고리명"
        v-model="filters.topCategoryId"
        :options="topCategoryNameOptions"
    />

    <!-- 카테고리명 드롭다운 -->
    <FilterSelect
        label="카테고리명"
        v-model="filters.categoryId"
        :options="categoryNameOptions"
    />

    <!-- 버튼 -->
    <CategoryFilterButtons
        @reset="resetFilters"
        @apply="applyFilters"
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch, watchEffect } from 'vue'
import FilterSelect from '@/components/common/filters/FilterSelect.vue'
import CategoryFilterButtons from "@/features/category/components/CategoryFilterButtons.vue";

const props = defineProps({
  topCategories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['apply', 'reset'])

const filters = reactive({
  topCategoryId: '',
  categoryId: ''
})

const topCategoryNameOptions = ref([])
const categoryNameOptions = ref([{ label: '전체', value: '' }])

watchEffect(() => {
  if (Array.isArray(props.topCategories) && props.topCategories.length > 0) {
    // 중복 제거 (topCategoryId 기준, 실제론 필요없지만 혹시 몰라서)
    const uniqueMap = new Map()
    props.topCategories.forEach(tc => {
      const key = tc.topCategoryId ?? tc.value;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, tc)
      }
    })
    topCategoryNameOptions.value = Array.from(uniqueMap.values()).map(tc => ({
      label: tc.topCategoryName ?? tc.label,
      value: String(tc.topCategoryId ?? tc.value)
    }))

  } else {
    topCategoryNameOptions.value = []
  }
})

// 상위 카테고리 선택 시 하위 카테고리 옵션 변경
watch(() => filters.topCategoryId, (newTopId) => {
  console.log('props.topCategories:', props.topCategories.map(tc => ({
    topCategoryId: tc.topCategoryId,
    topCategoryName: tc.topCategoryName,
    categories: tc.categories,
    typeOfId: typeof tc.topCategoryId,
  })))
  console.log('topCategoryNameOptions:', topCategoryNameOptions.value)

  filters.categoryId = ''

  const selectedTop = props.topCategories.find(
      t => String(t.topCategoryId ?? t.value) === String(newTopId)
  )
  if (!selectedTop || !Array.isArray(selectedTop.categories)) {
    categoryNameOptions.value = [{ label: '전체', value: '' }]
    return
  }
  categoryNameOptions.value = [
    ...selectedTop.categories.map(cat => ({
      label: cat.categoryName,
      value: String(cat.categoryId)
    }))
  ]
}, { immediate: true })

const applyFilters = () => {
  emit('apply', {
    topCategoryId: filters.topCategoryId || '',
    categoryId: filters.categoryId || ''
  })
}

const resetFilters = () => {
  filters.topCategoryId = ''
  filters.categoryId = ''
  categoryNameOptions.value = [{ label: '전체', value: '' }]
  emit('reset', {})
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
