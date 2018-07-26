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
        resizeCanvas(img.width, img.height)
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
    console.log(e)
    if (e.clipboardData) {
      const items = e.clipboardData.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          const source = window.URL.createObjectURL(blob)
          const pastedImage = new Image()
          pastedImage.onload = () => {
            resizeCanvas(
              Math.max(canvas.width, pastedImage.width),
              Math.max(canvas.height, pastedImage.height)
            )
            ctx.drawImage(pastedImage, 0, 0)
            dispatch({
              type: types.IMAGE_CHANGED,
              data: ctx.getImageData(0, 0, canvas.width, canvas.height),
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

function resizeCanvas (toWidth, toHeight) {
  if (canvas.width !== toWidth || canvas.height !== toHeight) {
    const p = performance.now()
    const newCanvas = document.createElement('canvas')
    newCanvas.width = toWidth
    newCanvas.height = toHeight
    const newCtx = newCanvas.getContext('2d')
    newCtx.fillStyle = '#FFFFFF'
    newCtx.fillRect(0, 0, toWidth, toHeight)
    newCtx.drawImage(canvas, 0, 0)
    
    ;[canvas.width, canvas.height] = [toWidth, toHeight]
    ctx.drawImage(newCanvas, 0, 0)
  }
}

function resizeActionCreator (toWidth, toHeight) {
  return function (dispatch, getState) {
    resizeCanvas(toWidth, toHeight)
    dispatch({
      type: types.IMAGE_CHANGED,
      data: ctx.getImageData(0, 0, canvas.width, canvas.height),
    })
  }
}

export { resizeActionCreator as resize }

function imageChangedActionCreator (imageData) {
  return function (dispatch, getState) {
    resizeCanvas(imageData.width, imageData.height)
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
