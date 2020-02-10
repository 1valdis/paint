import { ActionTypes, Color } from '../actions'
import { AnyAction } from 'redux'

export interface ColorsStoreState {
  list: Color[]
  activeColor: 'primary' | 'secondary'
  primary: number
  secondary: number
}

export const colorsReducer = (
  state: ColorsStoreState | undefined = {
    list: [
      { r: 0, g: 0, b: 0 },
      { r: 127, g: 127, b: 127 },
      { r: 136, g: 0, b: 21 },
      { r: 237, g: 28, b: 36 },
      { r: 255, g: 127, b: 39 },
      { r: 255, g: 242, b: 0 },
      { r: 34, g: 177, b: 76 },
      { r: 0, g: 162, b: 232 },
      { r: 63, g: 72, b: 204 },
      { r: 163, g: 73, b: 164 },
      { r: 255, g: 255, b: 255 },
      { r: 195, g: 195, b: 195 },
      { r: 185, g: 122, b: 87 },
      { r: 255, g: 174, b: 201 },
      { r: 255, g: 201, b: 14 },
      { r: 239, g: 228, b: 176 },
      { r: 181, g: 230, b: 29 },
      { r: 153, g: 217, b: 234 },
      { r: 112, g: 176, b: 190 },
      { r: 200, g: 191, b: 231 }
    ],
    activeColor: SelectedColor.primary,
    primary: 0,
    secondary: 10
  },
  action: AnyAction
) => {
  const newState = { ...state }
  switch (action.type) {
    case ActionTypes.selectColor:
      newState[newState.activeColor] = action.index
      return newState
    case ActionTypes.addColor:
      if (newState.list.length !== 30) {
        newState.list = [...newState.list, action.value]
        newState[newState.activeColor] = state.list.length
      } else {
        newState.list = [
          ...newState.list.slice(0, 20),
          ...newState.list.slice(21),
          action.value
        ]
        newState[newState.activeColor] = state.list.length - 1
      }
      return newState
    case ActionTypes.changeActiveColor:
      newState.activeColor = action.activeColor
      return newState
    default:
      return state
  }
}
