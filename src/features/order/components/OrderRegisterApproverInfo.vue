<template>
  <div class="info-card">
    <div class="info-header">결재자 정보</div>
    <div class="grid grid-2 gap-6">
      <InputField
          label="성명"
          placeholder="성명 입력"
          :model-value="localApprover.name"
          @update:model-value="val => updateField('name', val)"
      />
      <InputField
          label="직책"
          placeholder="직책 입력"
          :model-value="localApprover.role"
          @update:model-value="val => updateField('role', val)"
      />
    </div>
    <SearchFieldWithButton label="결재자 검색" @search="emit('searchApprover')" />
  </div>
</template>

<script setup>
import InputField from '@/components/common/fields/InputField.vue'
import SearchFieldWithButton from '@/components/common/fields/SearchFieldWithButton.vue'

const props = defineProps({
  approver: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:approver', 'searchApprover'])

const localApprover = props.approver

function updateField(field, value) {
  const updated = { ...localApprover, [field]: value }
  emit('update:approver', updated)
}
</script>
