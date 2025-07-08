<template>
  <template>
    <div class="left-section">
      <slot name="header" />
      <slot name="form" />
    </div>
  </template>
</template>

<style scoped>
.left-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>