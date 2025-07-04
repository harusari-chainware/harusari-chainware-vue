<template>
  <div class="skeleton-table-wrapper">
    <table class="skeleton-table">
      <thead>
      <tr>
        <th v-for="n in columns" :key="'th-' + n">
          <div class="skeleton-header shimmer"></div>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in rows" :key="'row-' + r">
        <td v-for="c in columns" :key="'cell-' + r + '-' + c">
          <div class="skeleton-cell shimmer" />
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Number, default: 8 },
  columns: { type: Number, default: 10 },
})
</script>

<style scoped>
.skeleton-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.skeleton-table {
  width: 100%;
  border-collapse: collapse;
}

.skeleton-table th,
.skeleton-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.skeleton-header {
  height: 14px;
  width: 60%;
  background-color: #e5e7eb;
  border-radius: 4px;
}

.skeleton-cell {
  height: 18px;
  background-color: #e5e7eb;
  border-radius: 4px;
}

.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 150px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(300px);
  }
}
</style>
