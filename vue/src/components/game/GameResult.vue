<template>
  <div class="game-result">
    <h2>Игра завершена</h2>
    <p>Победитель: {{ result?.winner ?? 'ничья' }}</p>
    <button type="button" @click="$emit('restart', scenario)">
      Начать заново
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  result?: { winner: number | null } | null
  scenario?: string
}>()

defineEmits<{
  restart: [scenario: string]
}>()
</script>

<style scoped lang="scss">
.game-result {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-family: Arial, sans-serif;
  z-index: 20000;
}
</style>
