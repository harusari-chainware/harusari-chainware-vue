<template>
  <div class="table-container">
    <table>
      <thead>
      <tr>
        <th
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
        >
          {{ col.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in items" :key="item.id || index">
        <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
        >
          <slot
              :name="`cell-${col.key}`"
              :item="item"
              :value="item[col.key]"
              :index="index"
          >
            {{ col.format ? col.format(item[col.key], item, index) : item[col.key] }}
          </slot>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
    // 불러서 사용할 때 각 column: { key, label, format?, align? }
  },
})
</script>

<style scoped src="@/assets/css/_table.css"></style>