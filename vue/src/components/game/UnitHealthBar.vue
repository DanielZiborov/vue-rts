<template>
  <div v-if="maxHealth" class="unit-health">
    <div
      class="unit-health__fill"
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
.unit-health {
  position: absolute;
  left: 50%;
  top: -8px;
  width: 30px;
  height: 4px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.45);
  transform: translateX(-50%);
  pointer-events: none;
}

.unit-health__fill {
  height: 100%;
  background: #5bd16b;
}
</style>
