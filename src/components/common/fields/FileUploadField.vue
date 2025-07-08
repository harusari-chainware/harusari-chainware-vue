<template>
  <div class="file-upload-field">
    <label class="field-label" :for="id">{{ label }}</label>
    <input
        type="file"
        :id="id"
        @change="onFileChange"
        multiple
        class="field-input"
    />
    <ul v-if="files.length" class="file-list">
      <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  id: String,
  modelValue: Array
})

const emit = defineEmits(['update:modelValue'])

const files = ref(props.modelValue || [])

function onFileChange(event) {
  const selectedFiles = Array.from(event.target.files)
  files.value = selectedFiles
  emit('update:modelValue', selectedFiles)
}
</script>

<style scoped>
.file-upload-field {
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
  color: var(--color-gray-900);
}

.file-list {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: var(--color-gray-800);
}

.file-list li {
  margin-bottom: 0.2rem;
}
</style>
