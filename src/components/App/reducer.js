import { combineReducers } from 'redux'
import { types } from './actions'
import colorsReducer from '../Colors/reducer'

const canvasReducer = (
  state = {
    data: null,
    downloadHref: null,
    name: 'Ваша пикча.png'
  },
  action
) => {
  switch (action.type) {
    case types.IMAGE_CHANGED:
      return {
        data: action.data,
        name: action.name || state.name,
        downloadHref: action.downloadHref
      }
    default:
      return state
  }
}

const reducer = combineReducers({
  image: canvasReducer,
  colors: colorsReducer
})

export default reducer
