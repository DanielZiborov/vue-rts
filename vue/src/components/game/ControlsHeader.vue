<template>
  <div class="controls-header">
    <strong>RTS</strong>
    <span>Сценарий: {{ scenario }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scenario?: string
}>()
</script>

<style scoped lang="scss">
.controls-header {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(16, 24, 32, 0.86);
  color: #fff;
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 10000;
}
</style>
