import { ActionTypes } from "../actions";
import { AnyAction } from "redux";

export interface ImageStoreState {
    data: ImageData
    name: string
  }

export const imageReducer = (
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
  