import { combineReducers } from 'redux'

import { types } from './actions'
import colorsReducer from '../Colors/reducer'
import instrumentsReducer from '../instruments/reducer'

const canvasReducer = (
  state = {
    data: null,
    name: 'Ваша пикча.png'
  },
  action
) => {
  switch (action.type) {
    case types.IMAGE_CHANGED:
      return {
        data: action.data,
        name: action.name || state.name,
      }
    default:
      return state
  }
}

const reducer = combineReducers({
  image: canvasReducer,
  colors: colorsReducer,
  instruments: instrumentsReducer
})

export default reducer
