import { combineReducers } from 'redux'

import { types } from './actions'
import colorsReducer from '../Colors/reducer'
import instrumentsReducer from '../instruments/reducer'

const canvasReducer = (
  state,
  action
) => {
  if (state === undefined) {
    const canvasEl = document.createElement('canvas')
    ;[canvasEl.width, canvasEl.height] = [800, 450]
    const ctx = canvasEl.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
    return {
      data: ctx.getImageData(0, 0, canvasEl.width, canvasEl.height),
      name: 'Ваша пикча.png'
    }
  }
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
