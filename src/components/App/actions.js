import { types as instrumentsTypes } from '../instruments/actions'

export const types = {
  IMAGE_CHANGED: 'app/image-changed'
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d', { alpha: false })
let href = null

export function createFile () {
  return function (dispatch, getState) {
    ;[canvas.width, canvas.height] = [800, 450]
    clearCanvas()
    dispatch({
      type: types.IMAGE_CHANGED,
      data: ctx.getImageData(0, 0, canvas.width, canvas.height),
      name: 'Ваша пикча.png'
    })
  }
}

export function openFile (e) {
  return function (dispatch, getState) {
    const file = e.nativeEvent.target.files[0]
    if (file == null) return
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        dispatch({
          type: types.IMAGE_CHANGED,
          data: ctx.getImageData(0, 0, img.width, img.height),
          name: file.name
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

export function paste (e) {
  return function (dispatch, getState) {
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
            pastedImageCtx.drawImage(pastedImage, 0, 0)
            
            dispatch({
              type: instrumentsTypes.CHANGE_INSTRUMENT,
              instrument: 'selection',
              selection: {
                imageData: pastedImageCtx.getImageData(0, 0, pastedImageCanvas.width, pastedImageCanvas.height),
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

function imageChangedActionCreator (imageData) {
  return function (dispatch, getState) {
    canvas.width = imageData.width
    canvas.height = imageData.height
    ctx.putImageData(imageData, 0, 0)
    dispatch({
      type: types.IMAGE_CHANGED,
      data: imageData
    })
  }
}

export { imageChangedActionCreator as changeImage }

function clearCanvas () {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function download (name) {
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
