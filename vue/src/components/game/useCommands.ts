interface CommandOptions {
  enqueue: (event: Record<string, unknown>) => void
  selectedUnitIds: any
  screenToWorld: (screenX: number, screenY: number) => { x: number, y: number }
}

export const useCommands = ({
  enqueue,
  selectedUnitIds,
  screenToWorld,
}: CommandOptions) => {

  const handleRightClick = (event?: MouseEvent) => {
  }

  const handleGroundClick = (
    event: MouseEvent,
    gameField: HTMLElement | null,
    append = false,
  ) => {
    if (!gameField || !selectedUnitIds.value.length) return

    const rect = gameField.getBoundingClientRect()
    const destination = screenToWorld(
      event.clientX - rect.left,
      event.clientY - rect.top,
    )

    enqueue({
      type: 'move',
      unitIds: [...selectedUnitIds.value],
      destination,
      append,
    })
  }

  return {
    handleRightClick,
    handleGroundClick,
  }
}
