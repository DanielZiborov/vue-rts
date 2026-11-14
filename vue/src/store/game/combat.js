export const findTarget = (state, targetType, targetId) => {
  const collection = targetType === 'building'
    ? state.buildings
    : state.units

  return collection.find((entity) => entity.id === targetId)
}

export const getAttackRange = (targetType, target) =>
  targetType === 'building'
    ? 55 + (target.size ?? 2) * 30
    : 65

export const updateAttack = () => false
