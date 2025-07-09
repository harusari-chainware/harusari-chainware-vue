<template>
    <div class="detail-row">
        <span class="label">{{ label }}</span>
        <span class="value">{{ value }}</span>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: [String, Number]
})
</script>

<style scoped>
.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--color-gray-100);
}
.label {
    font-weight: 500;
    color: var(--color-gray-600);
}
.value {
    color: var(--color-gray-900);
}
</style>