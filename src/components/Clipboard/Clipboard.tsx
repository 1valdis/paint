import './Clipboard.css'
import { FunctionComponent, useEffect, useState } from 'react'

export interface ClipboardProps {
  onPaste: (blob: Blob) => void
  onCopy: () => void
  onCut: () => void
  canCutOrCopy: boolean
}

export const Clipboard: FunctionComponent<ClipboardProps> = (props) => {
  const [clipboardWriteState, setClipboardWriteState] = useState<PermissionState | null>(null)
  const [clipboardReadState, setClipboardReadState] = useState<PermissionState | null>(null)

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
      <button
        disabled={[null, 'denied'].includes(clipboardWriteState) || !props.canCutOrCopy}
        onClick={props.onCut}>
        Cut
      </button>
      <button
        disabled={[null, 'denied'].includes(clipboardWriteState) || !props.canCutOrCopy}
        onClick={props.onCopy}>
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
