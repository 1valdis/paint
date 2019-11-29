import { ActionTypes } from './types'
import { ThunkAction } from 'redux-thunk'
import { StoreState } from '../reducers'
import { ChangeEvent } from 'react'
import { ChangeInstrumentAction, Instruments } from './instruments'

export interface ChangeImageAction {
  type: ActionTypes.changeImage
  data: ImageData
  name?: string
}

const canvas = document.createElement('canvas')

const ctx = canvas.getContext('2d', { alpha: false })
if (!ctx) throw new Error("Coudn't acquire context")

let href: string

export const createFile = (): ThunkAction<
  void,
  StoreState,
  undefined,
  ChangeImageAction
> => {
  return function(dispatch) {
    ;[canvas.width, canvas.height] = [800, 450]
    clearCanvas()
    dispatch({
      type: ActionTypes.changeImage,
      data: ctx.getImageData(0, 0, canvas.width, canvas.height),
      name: 'Ваша пикча.png'
    })
  }
}

export const openFile = (
  e: ChangeEvent<HTMLInputElement>
): ThunkAction<void, StoreState, undefined, ChangeImageAction> => {
  return function(dispatch) {
    const input = e.nativeEvent.currentTarget as HTMLInputElement
    const file = input.files && input.files[0]
    if (file == null) return
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        dispatch({
          type: ActionTypes.changeImage,
          data: ctx.getImageData(0, 0, img.width, img.height),
          name: file.name
        })
      }
      img.src = (e.currentTarget as FileReader).result as string
    }
    reader.readAsDataURL(file)
  }
}

export function paste(
  e: ClipboardEvent
): ThunkAction<void, StoreState, undefined, ChangeInstrumentAction> {
  return function(dispatch) {
    if (e.clipboardData) {
      const items = e.clipboardData.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          const source = window.URL.createObjectURL(blob)
          const pastedImage = new Image()
          pastedImage.onload = () => {
            const pastedImageCanvas = document.createElement('canvas')
            pastedImageCanvas.width = pastedImage.width
            pastedImageCanvas.height = pastedImage.height
            const pastedImageCtx = pastedImageCanvas.getContext('2d')
            if (!pastedImageCtx) throw new Error("Coudn't acquire context")
            pastedImageCtx.drawImage(pastedImage, 0, 0)

            dispatch({
              type: ActionTypes.changeInstrument,
              instrumentData: {
                instrument: Instruments.selection,
                selectionImageData: pastedImageCtx.getImageData(
                  0,
                  0,
                  pastedImageCanvas.width,
                  pastedImageCanvas.height
                ),
                coords: {
                  top: 0,
                  left: 0,
                  width: pastedImage.width,
                  height: pastedImage.height
                }
              }
            })
          }
          pastedImage.src = source
          break
        }
      }
      e.preventDefault()
    }
  }
}

export const changeImage = (
  imageData: ImageData
): ThunkAction<void, StoreState, undefined, ChangeImageAction> => {
  return function(dispatch, getState) {
    canvas.width = imageData.width
    canvas.height = imageData.height
    ctx.putImageData(imageData, 0, 0)
    dispatch({
      type: ActionTypes.changeImage,
      data: imageData
    })
  }
}

export const clearCanvas = () => {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export const download = (name: string) => {
  canvas.toBlob(blob => {
    if (href !== null) {
      window.URL.revokeObjectURL(href)
    }
    href = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = name
    a.href = href
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  })
}
