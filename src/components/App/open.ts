export const open = async (file: File): Promise<{ canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }> => {
  const reader = new FileReader()
  await new Promise<ProgressEvent<FileReader>>(resolve => {
    reader.readAsDataURL(file)
    reader.onload = resolve
  })
  return new Promise(resolve => {
    reader.readAsDataURL(file as Blob)
    reader.onload = e => {
      if (!e.target) throw new Error("Couldn't access FileReader from event")
      const img = new Image()
      img.src = e.target.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error("Coulnd't create context")
        ctx.drawImage(img, 0, 0)
        resolve({ canvas, context: ctx })
      }
    }
  })
}
