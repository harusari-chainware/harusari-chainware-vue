<template>
  <div class="search-field" @click.outside="showDropdown = false">
    <label class="field-label" :for="id">{{ label }}</label>
    <div class="search-row relative">
      <input
          :id="id"
          type="text"
          v-model="keyword"
          :placeholder="placeholder"
          class="field-input"
          @input="onInput"
          @focus="onFocus"
      />
      <!-- 드롭다운 -->
      <ul v-if="showDropdown && results.length" class="dropdown-list">
        <li
            v-for="item in results"
            :key="item[idKey] ?? item.id"
            class="dropdown-item"
            @click="selectItem(item)"
        >
          {{ item[labelKey] ?? '알 수 없음' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import debounce from 'lodash.debounce'

const props = defineProps({
  label: String,
  modelValue: String,
  placeholder: String,
  id: String,
  fetchFn: {
    type: Function,
    required: true
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  idKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const keyword = ref(props.modelValue || '')
const results = ref([])
const showDropdown = ref(false)

watch(() => props.modelValue, (val) => {
  if (val !== keyword.value) keyword.value = val
})

watch(keyword, (val) => {
  emit('update:modelValue', val)
})

const search = debounce(async () => {
  try {
    const res = await props.fetchFn({ [props.labelKey]: keyword.value })
    results.value = res.data?.data?.contents || []
    showDropdown.value = true
  } catch (e) {
    console.error('❌ 검색 실패:', e)
    results.value = []
  }
}, 300)

function onInput() {
  search()
}

function onFocus() {
  if (results.value.length) showDropdown.value = true
  else search()
}

function selectItem(item) {
  emit('select', item)
  emit('update:modelValue', item[props.labelKey])
  keyword.value = item[props.labelKey]
  showDropdown.value = false
}
</script>

<style scoped>
.search-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
  font-size: var(--font-info-label);
  color: var(--color-gray-700);
}

.search-row {
  display: flex;
  flex-direction: column;
  position: relative;
}

.field-input {
  padding: 0.5rem;
  font-size: var(--font-info-value);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-gray-50);
  color: var(--color-gray-900);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: white;
  z-index: 10;
  margin-top: 0.2rem;
}

.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--color-gray-100);
}
</style>
