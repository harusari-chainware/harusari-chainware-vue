<template>
    <table>
        <thead>
        <tr>
            <th v-for="column in columns" :key="column.key" :style="{ textAlign: column.align || 'left' }">
                {{ column.label }}
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in items" :key="item.id || index">
            <td
                    v-for="column in columns"
                    :key="column.key"
                    :style="{ textAlign: column.align || 'left' }"
            >
                <!-- 슬롯 렌더링 -->
                <slot
                        :name="`cell-${column.key}`"
                        :item="item"
                        :value="resolveValue(item, column, index)"
                        :index="index"
                >
                    {{ resolveValue(item, column, index) }}
                </slot>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script setup>

defineProps({
    items: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    }
})

// 컬럼의 format 함수가 있으면 적용, 없으면 값 반환
const resolveValue = (item, column, index) => {
    if (typeof column.format === 'function') {
        return column.format(item[column.key], item, index)
    }
    return item[column.key]
}
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--color-gray-200);
    text-align: center;
}
thead tr {
    background-color: var(--color-gray-100);
}
tbody tr:hover {
    background-color: var(--color-gray-50);
}
</style>