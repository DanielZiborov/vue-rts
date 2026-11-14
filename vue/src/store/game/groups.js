export const GROUP_COLORS = [
  '#4f7cff',
  '#e05a4f',
  '#49b36b',
  '#d6a13a',
  '#a45bd3',
  '#2fb6b0',
]

export const getGroupColor = (groupId) =>
  GROUP_COLORS[(Math.max(1, groupId) - 1) % GROUP_COLORS.length]

export const handleAssignGroup = (state, event) => {
}

export const handleSelectGroup = (state, event) => {
}
