import { Action, getInitialState } from '../actions'

export interface ColorsStoreState {
  list: {
    r: number
    g: number
    b: number
  }[]
  activeColor: 'primary' | 'secondary'
  primary: number
  secondary: number
}

export const colorsReducer = (
  state: ColorsStoreState | undefined = getInitialState().colors,
  action: Action
) => {
  const newState = { ...state }
  switch (action.type) {
    case 'selectColor':
      newState[newState.activeColor] = action.payload.index
      return newState
    case 'addColor':
      if (newState.list.length !== 30) {
        newState.list = [...newState.list, action.payload.value]
        newState[newState.activeColor] = state.list.length
      } else {
        newState.list = [
          ...newState.list.slice(0, 20),
          ...newState.list.slice(21),
          action.payload.value
        ]
        newState[newState.activeColor] = state.list.length - 1
      }
      return newState
    case 'changeActiveColor':
      newState.activeColor = action.payload.activeColor
      return newState
    default:
      return state
  }
}
