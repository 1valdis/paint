export const types = {
  ADD_COLOR: 'colors/add',
  SELECT_COLOR: 'colors/select',
  CHANGE_ACTIVE_COLOR: 'colors/change-active'
}

export function onActiveColorChange (activeColor) {
  return {
    type: types.CHANGE_ACTIVE_COLOR,
    activeColor
  }
}
