export const createUnit = (id, groupId, x, y) => ({
  id,
  type: 'unit',
  groupId,
  x,
  y,
  target: null,
  path: [],
  commandQueue: [],
  activeCommand: null,
  speed: 100,
})

export const findUnit = (state, unitId) =>
  state.units.find((unit) => unit.id === unitId)
