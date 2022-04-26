export const pasteFromEvent = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  setMainCanvas: (newCanvas: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }) => void
) => async (e: ClipboardEvent) => {
  if (e.clipboardData) {
    const items = e.clipboardData.items
    if (!items) return

    const imageClipboardItem = [...items].find(item => item.type.indexOf('image') !== -1)
    if (!imageClipboardItem) return

    const blob = imageClipboardItem.getAsFile()
    if (!blob) return
    const source = window.URL.createObjectURL(blob)
    const pastedImage = new Image()
    pastedImage.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pastedImage.width
      canvas.height = pastedImage.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error("Couldn't create context")
      context.drawImage(pastedImage, 0, 0)
      setMainCanvas({ canvas, context })
    }
    pastedImage.src = source

    e.preventDefault()
  }
}
