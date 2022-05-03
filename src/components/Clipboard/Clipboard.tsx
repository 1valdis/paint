import './Clipboard.css'
import { FunctionComponent, useEffect, useState } from 'react'

export interface ClipboardProps {
  canvas: HTMLCanvasElement
  onPaste: (blob: Blob) => void
}

export const Clipboard: FunctionComponent<ClipboardProps> = (props) => {
  const [clipboardWriteState, setClipboardWriteState] = useState<PermissionState | null>(null)
  const [clipboardReadState, setClipboardReadState] = useState<PermissionState | null>(null)

  const copy = async () => {
    const blob = await new Promise<Blob | null>(resolve =>
      props.canvas.toBlob(resolve, 'image/png', 1)
    )
    if (!blob) throw new Error("Couldn't acquire blob from canvas")
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
  }

  const paste = async () => {
    const clipboardItems = await navigator.clipboard.read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (!type.startsWith('image/')) continue
        const blob = await clipboardItem.getType(type)
        props.onPaste(blob)
        return
      }
    }
  }

  useEffect(() => {
    const readStateListener = function (this: PermissionStatus) {
      setClipboardReadState(this.state)
    }
    const writeStateListener = function (this: PermissionStatus) {
      setClipboardWriteState(this.state)
    }
    async function init (): Promise<[PermissionStatus, PermissionStatus]> {
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
