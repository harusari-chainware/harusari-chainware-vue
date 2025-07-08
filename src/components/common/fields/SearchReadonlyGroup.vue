<!-- SearchReadonlyGroup.vue -->
<template>
  <div class="search-readonly-group">
    <label class="group-label">{{ label }}</label>
    <div class="fields-and-button">
      <div class="readonly-fields">
        <div
            class="readonly-grid"
            :style="`grid-template-columns: repeat(${columnCount}, 1fr)`"
        >
          <div
              class="readonly-field"
              v-for="field in fields"
              :key="field.key"
          >
            <label class="field-label">{{ field.label }}</label>
            <input
                type="text"
                :value="modelValue?.[field.key] || ''"
                readonly
                class="field-input"
            />
          </div>
        </div>
      </div>
      <div class="search-button-area">
        <StatusButton
            type="primary"
            @click="$emit('search')"
            style="padding: 8px 16px"
        >
          검색
        </StatusButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusButton from '@/components/common/StatusButton.vue'

const props = defineProps({
  label: String,
  fields: Array, // ex: [{ key: 'name', label: '성명' }, { key: 'role', label: '직책' }]
  modelValue: Object
})

defineEmits(['search'])

const columnCount = computed(() => {
  // if (props.fields.length === 1) return 1
  // if (props.fields.length === 2) return 2
  // return 3 // 필드 3개 이상이면 3칸으로
  return props.fields.length
})
</script>

<style scoped>
.search-readonly-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.group-label {
  font-size: var(--font-header);
  color: var(--color-gray-700);
  font-weight: bold;
  border-left: 2px solid var(--color-gray-600);
  padding-left: 0.5rem;
}

.fields-and-button {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.readonly-fields {
  flex: 1;
}

.readonly-grid {
  display: grid;
  gap: 1.5rem;
}

.readonly-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.field-input {
  padding: 0.5rem;
  font-size: var(--font-info-value);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-gray-50);
  color: var(--color-gray-800);
}

.search-button-area {
  flex-shrink: 0;
}
</style>
