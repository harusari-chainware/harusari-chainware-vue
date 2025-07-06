<template>
  <div class="detail-more-link">
    <StatusButton type="outline" @click="goTo">
      {{ label }}
    </StatusButton>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import StatusButton from '@/components/common/StatusButton.vue'

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: '더보기'
  }
})

const router = useRouter()
const goTo = () => {
  router.push(props.to)
}
</script>

<style scoped>
.detail-more-link {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
