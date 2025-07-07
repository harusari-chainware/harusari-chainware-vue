<template>
  <RegisterRightPanel>
    <template #default>
      <div class="search-box">
        <p>우측 확장 검색 영역입니다. 예: 거래처 검색 결과</p>
        <!-- 검색 결과 리스트 또는 필터가 들어갈 수 있음 -->
      </div>
    </template>
  </RegisterRightPanel>
</template>

<script setup>
import RegisterRightPanel from '@/components/layout/registerview/RegisterRightPanel.vue'
</script>
