import { createCanvas } from './utils'

declare interface ModernClipboard {
  write(data: ClipboardItem[]): Promise<void>
  read(): Promise<Array<ClipboardItem>>
}
declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob })
  types: Array<string>
  getType(type: string): Promise<Blob>
}

export class ImageClipboard {
  private clipboardWritePermission?: PermissionStatus
  private clipboardReadPermission?: PermissionStatus

  async init() {
    ;[
      this.clipboardWritePermission,
      this.clipboardReadPermission
    ] = await Promise.all([
      navigator.permissions.query({
        name: 'clipboard-write' as PermissionName
      }),
      navigator.permissions.query({
        name: 'clipboard-read' as PermissionName
      })
    ])
    this.clipboardReadPermission.onchange = () =>
      console.log(
        `Read permission state changed to ${this.clipboardReadPermission?.state}`
      )
    this.clipboardWritePermission.onchange = () =>
      console.log(
        `Write permission state changed to ${this.clipboardWritePermission?.state}`
      )
  }

  async copy(canvas: HTMLCanvasElement) {
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/png', 1)
    )
    if (!blob) throw new Error("Couldn't acquire blob from canvas")
    await ((navigator.clipboard as unknown) as ModernClipboard).write([
      new ClipboardItem({ 'image/png': blob })
    ])
  }

  async paste(): Promise<HTMLCanvasElement | null> {
    const clipboardItems = await ((navigator.clipboard as unknown) as ModernClipboard).read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (!type.startsWith('image/')) continue
        const blob = await clipboardItem.getType(type)
        const img = document.createElement('img')
        img.src = URL.createObjectURL(blob)
        await new Promise(resolve => {
          img.onload = resolve
        })
        const { canvas, context } = createCanvas(img.width, img.height)
        context.drawImage(img, 0, 0)
        URL.revokeObjectURL(img.src)
        return canvas
      }
    }
    return null
  }
}
