import { computed, ref } from 'vue'

export const useSelection = () => {
  const dragStart = ref(null)
  const dragCurrent = ref(null)
  const selectionBox = computed(() => null)

  const handleMouseDown = () => {}
  const handleMouseMove = () => {}
  const handleMouseUp = () => false
  const handleMouseLeave = () => {}

  return {
    dragStart,
    dragCurrent,
    selectionBox,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  }
}
