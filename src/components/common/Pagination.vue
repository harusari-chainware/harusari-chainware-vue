<template>
  <nav class="pagination-container" aria-label="페이지 네비게이션">
    <ul class="pagination">
      <li
          class="page-item"
          :class="{ disabled: currentPageGroup === 1 }"
          @click="goToPrevGroup"
      >
        <i class="fa-solid fa-caret-left page-icon" />
      </li>

      <li
          v-for="page in pageNumbers"
          :key="page"
          class="page-item"
          :class="{ active: page === props.modelValue }"
          @click="$emit('update:modelValue', page)"
      >
        <span class="page-link">{{ page }}</span>
      </li>

      <li
          class="page-item"
          :class="{ disabled: currentPageGroup === totalGroups }"
          @click="goToNextGroup"
      >
        <i class="fa-solid fa-caret-right page-icon" />
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  pagesPerGroup: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue'])

// 전체 페이지 수
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

// 현재 페이지 그룹 (1부터 시작)
const currentPageGroup = computed(() =>
    Math.floor((props.modelValue - 1) / props.pagesPerGroup) + 1
)

// 전체 그룹 수
const totalGroups = computed(() =>
    Math.ceil(totalPages.value / props.pagesPerGroup)
)

// 현재 그룹의 시작~끝 페이지 번호
const pageNumbers = computed(() => {
  const start = (currentPageGroup.value - 1) * props.pagesPerGroup + 1
  const end = Math.min(start + props.pagesPerGroup - 1, totalPages.value)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 이전 그룹 이동
const goToPrevGroup = () => {
  if (currentPageGroup.value > 1) {
    emit('update:modelValue', (currentPageGroup.value - 2) * props.pagesPerGroup + 1)
  }
}

// 다음 그룹 이동
const goToNextGroup = () => {
  if (currentPageGroup.value < totalGroups.value) {
    emit('update:modelValue', currentPageGroup.value * props.pagesPerGroup + 1)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination {
  display: flex;
  gap: 5px;
  list-style: none;
  padding: 0;
}

.page-item {
  cursor: pointer;
}

.page-item.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.page-link,
.page-icon {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: #1f2d3d;
  background-color: #fff;
  transition: background-color 0.2s;
}

.page-link:hover,
.page-icon:hover {
  background-color: #f0f0f0;
}

.page-item.active .page-link {
  background-color: #3aaed8;
  color: white;
}
</style>
