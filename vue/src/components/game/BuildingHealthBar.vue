<template>
  <div v-if="maxHealth" class="building-health">
    <div
      class="building-health__fill"
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  health?: number
  maxHealth?: number
}

const props = defineProps<Props>()

const percent = computed(() => {
  if (!props.maxHealth) return 0

  return Math.max(0, Math.min(100, (props.health ?? 0) / props.maxHealth * 100))
})
</script>

<style scoped lang="scss">
.building-health {
  position: absolute;
  left: 50%;
  top: 70px;
  width: 120px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.45);
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 6;
}

.building-health__fill {
  height: 100%;
  background: #5bd16b;
}
</style>
