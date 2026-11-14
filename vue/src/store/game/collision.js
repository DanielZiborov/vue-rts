export const collisionDistance = (first, second) =>
  Math.hypot(second.x - first.x, second.y - first.y)

export const canMoveTo = (state, unit, nextPosition) => {
  return true
}
