export const types = {
  IMAGE_CHANGED: 'app/image-changed'
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d', { alpha: false })

export function createFile () {
  return function (dispatch, getState) {
    ;[canvas.width, canvas.height] = [800, 450]
    clearCanvas()
    setupHref(getState().image.downloadHref, href =>
      dispatch({
        type: types.IMAGE_CHANGED,
        data: ctx.getImageData(0, 0, canvas.width, canvas.height),
        downloadHref: href
      })
    )
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
        setupHref(getState().image.downloadHref, href =>
          dispatch({
            type: types.IMAGE_CHANGED,
            data: ctx.getImageData(0, 0, img.width, img.height),
            name: file.name,
            downloadHref: href
          })
        )
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
            resizeCanvas(
              Math.max(canvas.width, pastedImage.width),
              Math.max(canvas.height, pastedImage.height)
            )
            ctx.drawImage(pastedImage, 0, 0)
            setupHref(getState().image.downloadHref, href =>
              dispatch({
                type: types.IMAGE_CHANGED,
                data: ctx.getImageData(0, 0, canvas.width, canvas.height),
                downloadHref: href
              })
            )
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
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ;[canvas.width, canvas.height] = [toWidth, toHeight]
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imageData, 0, 0)
}

function clearCanvas () {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function setupHref (prevHref, callback) {
  canvas.toBlob(blob => {
    if (prevHref != null) {
      window.URL.revokeObjectURL(prevHref)
    }
    callback(window.URL.createObjectURL(blob))
  })
}
