<template>
  <ul class="submenu">
    <li v-for="item in items" :key="item.name">
      <RouterLink :to="item.route">
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
  padding-left: 0.5rem;
  margin-bottom: 1.5rem;
}

.submenu li a {
  text-decoration: none;
  color: #4a5662;
  font-size: 0.9rem;
  padding: 0.4rem 0.6rem;
  display: block;
  border-radius: 6px;
}

.submenu li a.router-link-active {
  background-color: #3aaed8;
  color: #fff;
}
</style>
