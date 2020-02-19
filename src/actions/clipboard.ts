import { ImageClipboard } from '../core/src/ImageClipboard'
import { StoreState } from '../reducers'
import { ThunkAction } from 'redux-thunk'
import { ChangeImageAction, changeImage } from '.'
import { createCanvas } from '../core/src/utils'

export interface CopyImageAction {
  type: 'copyImage'
}
export interface CutImageAction {
  type: 'cutImage'
}
export interface PasteImageAction {
  type: 'pasteImage'
}
export interface ClipboardPermissionChangeAction {
  type: 'clipboardPermissionChange'
  payload: {
    read?: 'granted' | 'denied' | 'prompt'
    write?: 'granted' | 'denied' | 'prompt'
  }
}

export const clipboard = new ImageClipboard()

let clipboardIsReady = false
;(async () => {
  await clipboard.init()
  clipboardIsReady = true
})()

export const copy = (): ThunkAction<
  void,
  StoreState,
  undefined,
  CopyImageAction
> => (dispatch, getState) => {
  if (!clipboardIsReady) return
  const imageData = getState().image.imageData
  const { canvas, context } = createCanvas(imageData.width, imageData.height)
  context.putImageData(imageData, 0, 0)
  clipboard.copy(canvas)
  dispatch({
    type: 'copyImage'
  })
}

export const pasteManually = (): ThunkAction<
  void,
  StoreState,
  undefined,
  ChangeImageAction | PasteImageAction
> => async dispatch => {
  if (!clipboardIsReady) return
  const pastedCanvas = await clipboard.paste()
  if (!pastedCanvas) return

  const { canvas, context } = createCanvas(
    pastedCanvas.width,
    pastedCanvas.height
  )
  context.drawImage(pastedCanvas, 0, 0)

  dispatch(changeImage(context.getImageData(0, 0, canvas.width, canvas.height)))
  dispatch({
    type: 'pasteImage'
  })
}

export const pasteFromEvent = (e: Event) => () => {}
