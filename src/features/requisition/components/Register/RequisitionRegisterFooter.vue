<template>
  <RegisterFooter>
    <template #actions>
      <StatusButton type="primary" @click="emit('submit')">
        {{ isEditMode ? '수정 완료' : '등록' }}
      </StatusButton>
      <StatusButton type="reset" @click="emit('cancel')">
        {{ isEditMode ? '돌아가기' : '취소' }}
      </StatusButton>
    </template>
  </RegisterFooter>
</template>

<script setup>
import { computed } from 'vue'
import RegisterFooter from '@/components/layout/registerview/RegisterFooter.vue'
import StatusButton from '@/components/common/StatusButton.vue'

const emit = defineEmits(['submit', 'cancel'])

const props = defineProps({
  mode: {
    type: String,
    default: 'create' // 'create' 또는 'edit'
  }
})

const isEditMode = computed(() => props.mode === 'edit')
</script>
