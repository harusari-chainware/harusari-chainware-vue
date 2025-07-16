<template>
  <RegisterRightPanel :title="panelTitle" @close="emit('close')">
      <div class="right-panel">
        <RequisitionSearchTable
            type="product"
            :vendor-name="props.vendorName"
            :multi="true"
            :selected="selectedProduct ? [selectedProduct] : []"
            @update:selected="(val) => selectedProduct = val[0]"
            @select="(item) => emit('selectProduct', item)"
        />
      </div>
  </RegisterRightPanel>
</template>

    <script setup>
      import RequisitionSearchTable from '@/features/requisition/components/Register/RequisitionSearchTable.vue'
      import {computed} from "vue";
      import RegisterRightPanel from "@/components/layout/registerview/RegisterRightPanel.vue";

      const props = defineProps({
        type: String,
        vendorName: String
      })
      const panelTitle = computed(() => '계약 상품 검색')


      const emit = defineEmits(['selectProduct'])
    </script>

    <style scoped>
      .right-panel {
        padding: 1rem;
        background-color: white;
        height: 100%;
        overflow-y: auto;
      }
    </style>
