<template>
  <ul class="submenu">
    <li v-for="item in items" :key="item.name">
      <RouterLink
          :to="item.route"
          class="menu-link"
          :class="{ 'active-link': isActive(item.route) }"
      >
        {{ item.name }}
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// import { useUserStore } from '@/stores/user'

const props = defineProps({
  items: Array
})

// const userStore = useUserStore()
// const userRole = userStore.role

// const filteredItems = computed(() =>
//     props.items.filter(item => item.roles.includes(userRole))
// )

const route = useRoute()

const isActive = (itemRoute) => {
  if (!itemRoute) return false
  return route.path.startsWith(itemRoute)
}
</script>

<style scoped>
.submenu {
  padding-left: 1.1rem;
  list-style: none;
}

.menu-link {
  display: block;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.1rem;
  text-decoration: none;
  font-size: 0.9rem;
  color: #4a5662;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.menu-link:not(.active-link):hover {
  background-color: #f1f4f6;
}

.active-link {
  background-color: #e9f5fa;
  color: #3aaed8;
}
</style>
