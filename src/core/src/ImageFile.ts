export class ImageFile {
  static create() {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 450
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error("Coulnd't create context")
    return ctx.getImageData(0, 0, 800, 450)
  }

  static async open(file: File): Promise<ImageData> {
    const reader = new FileReader()
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
          resolve(ctx.getImageData(0, 0, img.width, img.height))
        }
      }
    })
  }

  static async save(canvas: HTMLCanvasElement) {
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve)
    )
    const href = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = name
    a.href = href
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(href)
  }
}
