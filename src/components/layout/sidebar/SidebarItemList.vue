<template>
    <ul class="sidebar-item-list">
        <li
                v-for="item in items"
                :key="item.route"
                @click="navigate(item.route)"
                :class="{ active: isActive(item.route) }"
        >
            <i v-if="item.icon" :class="item.icon" class="item-icon"></i>
            <span>{{ item.name }}</span>
        </li>
    </ul>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
    items: {
        type: Array,
        required: true
    }
})

const router = useRouter()
const route = useRoute()

const navigate = (routePath) => {
    if (route.path !== routePath) {
        router.push(routePath)
    }
}

const isActive = (routePath) => {
    return route.path === routePath
}
</script>

<style scoped>
.sidebar-item-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.sidebar-item-list li {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: var(--font-sidebar-item, 0.95rem);
    color: var(--color-gray-700);
    border-radius: 6px;
    padding: 0.4rem 0.6rem;
    transition: background 0.2s;
}

.sidebar-item-list li:hover {
    background-color: var(--color-hover-light, #f0f7fb);
}

.sidebar-item-list li.active {
    background-color: var(--color-primary-light, #e3f2fd);
    color: var(--color-primary, #1976d2);
}

.item-icon {
    font-size: 0.9rem;
    width: 18px;
    min-width: 18px;
    text-align: center;
    margin-right: 0.4rem;
}
</style>
