<template>
  <div class="game-controls">
    <div class="game-controls__hint">
      ЛКМ — выбрать / двигаться, Shift — очередь, ПКМ — отмена
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-controls {
  position: absolute;
  left: 20px;
  bottom: 20px;
  max-width: 360px;
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(16, 24, 32, 0.86);
  color: #fff;
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  z-index: 10000;
}
</style>
