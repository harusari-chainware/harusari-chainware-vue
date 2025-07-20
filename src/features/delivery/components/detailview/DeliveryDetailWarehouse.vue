<template>
  <InfoGroup title="창고 정보">
    <InfoItem>
      <template #label>창고명</template>
      <template #value>{{ warehouseInfo.warehouseName }}</template>
    </InfoItem>
    <InfoItem>
      <template #label>창고 주소</template>
      <template #value>
        {{
          `${warehouseInfo.warehouseAddress.addressRoad}${warehouseInfo.warehouseAddress.addressDetail ? ', ' + warehouseInfo.warehouseAddress.addressDetail : ''} (${warehouseInfo.warehouseAddress.zipcode})`
        }}
      </template>
    </InfoItem>
    <InfoItem>
      <template #label>창고 관리자</template>
      <template #value>{{ warehouseInfo.warehouseManagerName }}</template>
    </InfoItem>
  </InfoGroup>
</template>

<script setup>
import InfoGroup from '@/components/layout/detailview/InfoGroup.vue'
import InfoItem from '@/components/layout/detailview/InfoItem.vue'

defineProps({ warehouseInfo: Object })
</script>
