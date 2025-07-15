<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop">
      <div class="modal">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <button @click="confirm">확인</button>
        <button @click="$emit('update:modelValue', false)">취소</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  description: String
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
}
</style>
