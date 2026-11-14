import { cellToWorld, worldToCell } from './terrain'

export const getPath = (state, unit, destination) => {
  const cell = worldToCell(destination.x, destination.y)

  return [cellToWorld(cell.col, cell.row)]
}
