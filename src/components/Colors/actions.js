export const types = {
  ADD_COLOR: 'colors/add',
  SELECT_COLOR: 'colors/select',
  CHANGE_ACTIVE_COLOR: 'colors/change-active'
}

export function changeActiveColor (activeColor) {
  return {
    type: types.CHANGE_ACTIVE_COLOR,
    activeColor
  }
}

export function addColor (e) {
  return (dispatch, getState) => {
    const hexRgb = e.target.value.match(/[A-Za-z0-9]{2}/g)
    const rgb = hexRgb.map(v => parseInt(v, 16))
    const rgbObject = { r: rgb[0], g: rgb[1], b: rgb[2] }
    const rgbObjectString = JSON.stringify(rgbObject)
    let found = false
    for (let i = 0; i < getState().colors.length; i++) {
      if (JSON.stringify(getState().colors[i]) === rgbObjectString) {
        found = true
        break
      }
    }
    if (!found) {
      console.log('yay!')
      dispatch({
        type: types.ADD_COLOR,
        value: rgbObject
      })
    }
  }
}

export function selectColor (index) {
  return {
    type: types.SELECT_COLOR,
    index
  }
}
