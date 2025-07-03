<template>
  <ul class="submenu">
    <li v-for="item in items" :key="item.name">
      <RouterLink :to="item.route" class="menu-link" active-class="active-link">
        {{ item.name }}
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'
// import { useUserStore } from '@/stores/user' // 사용자 role 불러오기

const props = defineProps({
  items: Array
})

// const userStore = useUserStore()
// const userRole = userStore.role

// const filteredItems = computed(() =>
//     props.items.filter(item => item.roles.includes(userRole))
// )
</script>

<style scoped>
.submenu {
  padding-left: 1.1rem;
  list-style: none;
}

.menu-link {
  display: block;
  padding: 0.4rem 0.6rem;
  text-decoration: none;
  font-size: 0.9rem;
  color: #4a5662;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.menu-link:hover {
  background-color: #f1f4f6;
}

.active-link {
  background-color: #3aaed8;
  color: #fff;
}
</style>
