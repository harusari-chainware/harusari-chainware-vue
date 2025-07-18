<template>
  <div class="info-card">
    <h3>{{ title }}</h3>
    <div v-for="(value, key) in items" :key="key" class="item">
      <span class="label">{{ key }}</span>
      <span class="value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  items: Object
})
</script>

<style scoped>
.info-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background-color: #fff;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.label {
  color: #555;
}
.value {
  font-weight: bold;
}
</style>
