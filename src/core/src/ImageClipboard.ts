/// <reference path="ImageClipboard.d.ts" />

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

  async copy(blob: Blob) {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
  }

  async paste(): Promise<Blob | null> {
    const clipboardItems = await navigator.clipboard.read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (!type.startsWith('image/')) continue
        const blob = await clipboardItem.getType(type)
        return blob
      }
    }
    return null
  }
}
