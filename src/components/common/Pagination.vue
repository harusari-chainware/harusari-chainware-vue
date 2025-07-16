<template>
    <nav v-if="totalPages > 0" class="pagination-container" aria-label="페이지 네비게이션">
        <ul class="pagination">
            <!-- 첫 페이지로 이동 -->
            <li
                    class="page-item"
                    :class="{ disabled: modelValue === 1 }"
                    @click="goToFirstPage"
                    aria-label="첫 페이지로 이동"
                    role="button"
            >
                <i class="fa-solid fa-angles-left page-icon" aria-hidden="true" />
            </li>

            <!-- 이전 페이지로 이동 -->
            <li
                    class="page-item"
                    :class="{ disabled: modelValue === 1 }"
                    @click="goToPrevPage"
                    aria-label="이전 페이지로 이동"
                    role="button"
            >
                <i class="fa-solid fa-caret-left page-icon" aria-hidden="true" />
            </li>

            <!-- 페이지 목록 -->
            <li
                    v-for="page in pageNumbers"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === modelValue }"
                    @click="$emit('update:modelValue', page)"
                    :aria-current="page === modelValue ? 'page' : null"
                    role="button"
            >
                <span class="page-link">{{ page }}</span>
            </li>

            <!-- 다음 페이지로 이동 -->
            <li
                    class="page-item"
                    :class="{ disabled: modelValue === totalPages }"
                    @click="goToNextPage"
                    aria-label="다음 페이지로 이동"
                    role="button"
            >
                <i class="fa-solid fa-caret-right page-icon" aria-hidden="true" />
            </li>

            <!-- 그룹 단위(10페이지) 앞으로 이동 -->
            <li
                    class="page-item"
                    :class="{ disabled: modelValue === totalPages }"
                    @click="goToNextGroup"
                    aria-label="다음 페이지 그룹으로 이동"
                    role="button"
            >
                <i class="fa-solid fa-angles-right page-icon" aria-hidden="true" />
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    itemsPerPage: { type: Number, default: 10 },
    pagesPerGroup: { type: Number, default: 10 }
})

const emit = defineEmits(['update:modelValue'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const currentPageGroup = computed(() =>
        Math.floor((props.modelValue - 1) / props.pagesPerGroup) + 1
)

const pageNumbers = computed(() => {
    const start = (currentPageGroup.value - 1) * props.pagesPerGroup + 1
    const end = Math.min(start + props.pagesPerGroup - 1, totalPages.value)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 버튼 클릭 로직
const goToFirstPage = () => {
    if (props.modelValue !== 1) {
        emit('update:modelValue', 1)
    }
}
const goToPrevPage = () => {
    if (props.modelValue > 1) {
        emit('update:modelValue', props.modelValue - 1)
    }
}
const goToNextPage = () => {
    if (props.modelValue < totalPages.value) {
        emit('update:modelValue', props.modelValue + 1)
    }
}
//  수정된 그룹 단위 앞으로 이동 버튼
const goToNextGroup = () => {
    const nextPage = Math.min(props.modelValue + props.pagesPerGroup, totalPages.value)
    if (props.modelValue !== nextPage) {
        emit('update:modelValue', nextPage)
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
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
    font-size: var(--font-pagination);
    color: var(--color-gray-700);
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    transition: background-color 0.2s, color 0.2s;
}

.page-link:hover,
.page-icon:hover {
    background-color: var(--color-hover);
}

.page-item.active .page-link {
    background-color: var(--color-primary);
    color: white;
    font-weight: bold;
}
</style>