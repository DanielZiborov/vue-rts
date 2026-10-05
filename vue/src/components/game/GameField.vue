<template>
  <div
      ref="gameField"
      class="game-field"
      @mousedown="handleMouseDown"
      @contextmenu.prevent="handleRightClick"
  >
    <div
        class="world"
        :style="worldStyle"
    >
      <div class="grid"></div>

      <div
          v-for="unit in units"
          :key="unit.id"
      >
        <GameUnit
            :x="worldToScreenX(unit.x)"
            :y="worldToScreenY(unit.y)"
            :selected="unit.id === selectedUnitId"
            @select="selectUnit(unit.id)"
        />
      </div>

      <div
          v-if="targetPosition"
          class="target"
          :style="targetStyle"
      >
        <div class="target-cross"></div>
      </div>

      <div class="origin">
        <div class="origin-x"></div>
        <div class="origin-y"></div>
      </div>
    </div>

    <div class="hud">
      <div class="hud-row">
        <strong>Camera</strong>
        <span>
          X: {{ Math.round(camera.x) }}
          Y: {{ Math.round(camera.y) }}
        </span>
      </div>

      <div class="hud-row">
        <strong>Selected</strong>
        <span>
          {{ selectedUnitId ?? 'none' }}
        </span>
      </div>

      <div class="hud-help">
        <div>Стрелки / WASD — камера</div>
        <div>ЛКМ — выбрать юнита</div>
        <div>ЛКМ по земле, если юнит выбран — переместить</div>
        <div>ПКМ — отменить выбор юнита</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'

import GameUnit from './GameUnit.vue'

interface Position {
  x: number
  y: number
}

interface Unit {
  id: number
  type: 'unit'
  x: number
  y: number
  speed: number
  target: Position | null
}

const gameField = ref<HTMLElement | null>(null)

const viewport = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
})

const camera = reactive({
  x: 0,
  y: 0,
  speed: 500,
})

const units = reactive<Unit[]>([
  {
    id: 1,
    type: 'unit',
    x: -150,
    y: -100,
    speed: 120,
    target: null,
  },
  {
    id: 2,
    type: 'unit',
    x: 100,
    y: -50,
    speed: 80,
    target: null,
  },
  {
    id: 3,
    type: 'unit',
    x: 0,
    y: 150,
    speed: 100,
    target: null,
  },
])

const selectedUnitId = ref<number | null>(null)

const targetPosition = ref<Position | null>(null)

const keys = new Set<string>()

let animationFrameId = 0
let previousTime = 0

const worldStyle = computed(() => ({
  width: `${viewport.width}px`,
  height: `${viewport.height}px`,
}))

const targetStyle = computed(() => {
  if (!targetPosition.value) {
    return {}
  }

  return {
    left: `${worldToScreenX(targetPosition.value.x)}px`,
    top: `${worldToScreenY(targetPosition.value.y)}px`,
  }
})

const selectedUnit = computed(() => {
  return units.find(unit => unit.id === selectedUnitId.value) ?? null
})



function worldToScreenX(worldX: number) {
  return (
      worldX -
      camera.x +
      viewport.width / 2
  )
}

function worldToScreenY(worldY: number) {
  return (
      worldY -
      camera.y +
      viewport.height / 2
  )
}

function screenToWorldX(screenX: number) {
  return (
      screenX -
      viewport.width / 2 +
      camera.x
  )
}

function screenToWorldY(screenY: number) {
  return (
      screenY -
      viewport.height / 2 +
      camera.y
  )
}

function selectUnit(unitId: number) {
  selectedUnitId.value = unitId

  const unit = units.find(item => item.id === unitId)

  if (unit) {
    targetPosition.value = unit.target
  }
}

function handleRightClick(): void {
  selectedUnitId.value = null
}

function moveSelectedUnit(position: Position) {
  if (!selectedUnit.value) {
    return
  }

  selectedUnit.value.target = position

  targetPosition.value = {
    x: position.x,
    y: position.y,
  }
}

function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) {
    return
  }

  if (!gameField.value) {
    return
  }

  const rect = gameField.value.getBoundingClientRect()

  const screenX = event.clientX - rect.left
  const screenY = event.clientY - rect.top

  const worldX = screenToWorldX(screenX)
  const worldY = screenToWorldY(screenY)

  moveSelectedUnit({
    x: worldX,
    y: worldY,
  })
}

function updateCamera(deltaTime: number) {
  let directionX = 0
  let directionY = 0

  if (keys.has('w') || keys.has('arrowup')) {
    directionY -= 1
  }

  if (keys.has('s') || keys.has('arrowdown')) {
    directionY += 1
  }

  if (keys.has('a') || keys.has('arrowleft')) {
    directionX -= 1
  }

  if (keys.has('d') || keys.has('arrowright')) {
    directionX += 1
  }

  if (directionX === 0 && directionY === 0) {
    return
  }

  const length = Math.sqrt(
      directionX * directionX +
      directionY * directionY,
  )

  directionX /= length
  directionY /= length

  camera.x += directionX * camera.speed * deltaTime
  camera.y += directionY * camera.speed * deltaTime
}

function updateUnits(deltaTime: number) {
  for (const unit of units) {
    if (!unit.target) {
      continue
    }

    const deltaX = unit.target.x - unit.x
    const deltaY = unit.target.y - unit.y

    const distance = Math.sqrt(
        deltaX * deltaX +
        deltaY * deltaY,
    )

    if (distance <= 1) {
      unit.x = unit.target.x
      unit.y = unit.target.y
      unit.target = null

      if (unit.id === selectedUnitId.value) {
        targetPosition.value = null
      }

      continue
    }

    const directionX = deltaX / distance
    const directionY = deltaY / distance

    const movement = unit.speed * deltaTime

    if (movement >= distance) {
      unit.x = unit.target.x
      unit.y = unit.target.y
      unit.target = null

      if (unit.id === selectedUnitId.value) {
        targetPosition.value = null
      }
    } else {
      unit.x += directionX * movement
      unit.y += directionY * movement
    }
  }
}

function gameLoop(time: number) {
  if (!previousTime) {
    previousTime = time
  }

  const deltaTime = Math.min(
      (time - previousTime) / 1000,
      0.05,
  )

  previousTime = time

  updateCamera(deltaTime)
  updateUnits(deltaTime)

  animationFrameId = requestAnimationFrame(gameLoop)
}

function handleKeyDown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()

  if (
      [
        'w',
        'a',
        's',
        'd',
        'arrowup',
        'arrowdown',
        'arrowleft',
        'arrowright',
      ].includes(key)
  ) {
    event.preventDefault()
    keys.add(key)
  }
}

function handleKeyUp(event: KeyboardEvent) {
  const key = event.key.toLowerCase()

  keys.delete(key)
}

function handleResize() {
  viewport.width = window.innerWidth
  viewport.height = window.innerHeight
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)

  animationFrameId = requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)

  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped lang="scss">
.game-field {
  position: relative;

  width: 100%;
  height: 100vh;

  overflow: hidden;

  background: #27352b;

  user-select: none;

  cursor: default;
}

.world {
  position: absolute;

  left: 0;
  top: 0;
}

.grid {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  background-image:
      linear-gradient(
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
      ),
      linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
      );

  background-size: 50px 50px;

  pointer-events: none;
}

.origin {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 0;
  height: 0;

  pointer-events: none;
}

.origin-x {
  position: absolute;

  left: -20px;
  top: -1px;

  width: 40px;
  height: 2px;

  background: red;
}

.origin-y {
  position: absolute;

  left: -1px;
  top: -20px;

  width: 2px;
  height: 40px;

  background: red;
}

.target {
  position: absolute;

  width: 20px;
  height: 20px;

  transform: translate(-50%, -50%);

  pointer-events: none;

  z-index: 5;
}

.target-cross {
  position: absolute;

  inset: 0;

  border: 2px solid #ffffff;
  border-radius: 50%;
}

.target-cross::before,
.target-cross::after {
  content: '';

  position: absolute;

  left: 50%;
  top: 50%;

  background: #ffffff;

  transform: translate(-50%, -50%);
}

.target-cross::before {
  width: 2px;
  height: 28px;
}

.target-cross::after {
  width: 28px;
  height: 2px;
}

.hud {
  position: absolute;

  left: 20px;
  top: 20px;

  min-width: 220px;

  padding: 14px;

  border-radius: 8px;

  background: rgba(0, 0, 0, 0.7);
  color: white;

  font-family: Arial, sans-serif;
  font-size: 14px;

  z-index: 100;
}

.hud-row {
  display: flex;
  justify-content: space-between;

  margin-bottom: 6px;
}

.hud-help {
  margin-top: 12px;
  padding-top: 10px;

  border-top: 1px solid rgba(255, 255, 255, 0.2);

  color: #ccc;

  line-height: 1.5;
}
</style>