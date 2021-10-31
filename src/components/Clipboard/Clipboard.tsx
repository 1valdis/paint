import './Clipboard.css'
import { FunctionComponent, useEffect, useState } from 'react'

function createCanvas (width?: number, height?: number) {
  const canvas = document.createElement('canvas')
  if (width) canvas.width = width
  if (height) canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error("Couldn't get canvas context")
  return { canvas, context }
}

declare interface ModernClipboard {
  write(data: ClipboardItem[]): Promise<void>
  read(): Promise<Array<ClipboardItem>>
}
declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob })
  types: Array<string>
  getType(type: string): Promise<Blob>
}

export interface ClipboardProps {
  canvas: HTMLCanvasElement
  onPaste: (canvas: HTMLCanvasElement) => void
}

export const Clipboard: FunctionComponent<ClipboardProps> = (props) => {
  const [clipboardWriteState, setClipboardWriteState] = useState<PermissionState | null>(null)
  const [clipboardReadState, setClipboardReadState] = useState<PermissionState | null>(null)

  const copy = async () => {
    const blob = await new Promise<Blob | null>(resolve =>
      props.canvas.toBlob(resolve, 'image/png', 1)
    )
    if (!blob) throw new Error("Couldn't acquire blob from canvas")
    await ((navigator.clipboard as unknown) as ModernClipboard).write([
      new ClipboardItem({ 'image/png': blob })
    ])
  }

  const paste = async (): Promise<HTMLCanvasElement | null> => {
    const clipboardItems = await ((navigator.clipboard as unknown) as ModernClipboard).read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (!type.startsWith('image/')) continue
        const blob = await clipboardItem.getType(type)
        const img = new Image()
        img.src = URL.createObjectURL(blob)
        await new Promise(resolve => {
          img.onload = resolve
        })
        const { canvas, context } = createCanvas(img.width, img.height)
        context.drawImage(img, 0, 0)
        URL.revokeObjectURL(img.src)
        props.onPaste(canvas)
      }
    }
    return null
  }

  useEffect(() => {
    const readStateListener = function (this: PermissionStatus) {
      setClipboardReadState(this.state)
    }
    const writeStateListener = function (this: PermissionStatus) {
      setClipboardWriteState(this.state)
    }
    async function init () {
      const [
        clipboardWritePermission,
        clipboardReadPermission
      ] = await Promise.all([
        navigator.permissions.query({
          name: 'clipboard-write' as PermissionName
        }),
        navigator.permissions.query({
          name: 'clipboard-read' as PermissionName
        })
      ])
      clipboardReadPermission.addEventListener('change', readStateListener)
      clipboardWritePermission.addEventListener('change', writeStateListener)
      setClipboardReadState(clipboardReadPermission.state)
      setClipboardWriteState(clipboardWritePermission.state)
      return [clipboardReadPermission, clipboardWritePermission]
    }

    const permissionPromises = init()

    return () => {
      async function cleanup () {
        const [clipboardReadPermission, clipboardWritePermission] = await permissionPromises
        clipboardReadPermission.removeEventListener('change', readStateListener)
        clipboardWritePermission.removeEventListener('change', writeStateListener)
      }
      cleanup()
    }
  }, [])

  const pasteDisabledMessage = clipboardWriteState
    ? {}
    : {
        title:
          'Unable to read from clipboard. Check that you have a newer browser version and access to clipboard is allowed on this page'
      }
  return (
    <nav className="clipboard">
      <button disabled={[null, 'denied'].includes(clipboardWriteState)} onClick={copy}>
        Cut
      </button>
      <button disabled={[null, 'denied'].includes(clipboardWriteState)} onClick={copy}>
        Copy
      </button>
      <button
        disabled={[null, 'denied'].includes(clipboardReadState)}
        onClick={paste}
        {...pasteDisabledMessage}>
        Paste
      </button>
    </nav>
  )
}
