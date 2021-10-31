export const pasteFromEvent = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  setMainCanvas: (newCanvas: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }) => void
) => async (e: ClipboardEvent) => {
  return new Promise((resolve, reject) => {
    if (e.clipboardData) {
      const items = e.clipboardData.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          const source = window.URL.createObjectURL(blob)
          const pastedImage = new Image()
          pastedImage.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = pastedImage.width
            canvas.height = pastedImage.height
            const context = canvas.getContext('2d')
            if (!context) throw new Error("Coulnd't create context")
            context.drawImage(pastedImage, 0, 0)
            setMainCanvas({ canvas, context })
          }
          pastedImage.onerror = reject
          pastedImage.src = source
          break
        }
      }
      e.preventDefault()
    }
  })
}
