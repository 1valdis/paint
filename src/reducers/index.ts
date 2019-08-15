import { SelectedColor, ActionTypes } from '../actions'

import { combineReducers, AnyAction } from 'redux'

import { colorsReducer } from './colors'
import { instrumentsReducer } from './instruments'

interface Color {
  r: number
  g: number
  b: number
}

export interface ColorsStoreState {
  list: Color[]
  activeColor: SelectedColor
  primary: number
  secondary: number
}

export interface ImageStoreState {
  data: ImageData
  name: string
}

export interface StoreState {
  image: ImageStoreState
  colors: ColorsStoreState
  instruments: any // todo fix that
}

const canvasReducer = (
  state: ImageStoreState | undefined,
  action: AnyAction
) => {
  if (state === undefined) {
    const canvasEl = document.createElement('canvas')
    ;[canvasEl.width, canvasEl.height] = [800, 450]
    const ctx = canvasEl.getContext('2d')
    if (!ctx) throw new Error("Coudn't acquire context")
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
    return {
      data: ctx.getImageData(0, 0, canvasEl.width, canvasEl.height),
      name: 'Ваша пикча.png'
    }
  }
  switch (action.type) {
    case ActionTypes.changeImage:
      return {
        data: action.data,
        name: action.name || state.name
      }
    default:
      return state
  }
}

export const reducer = combineReducers<StoreState>({
  image: canvasReducer,
  colors: colorsReducer,
  instruments: instrumentsReducer
})

export default reducer
