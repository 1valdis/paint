import './Clipboard.css'
import { ChangeEventHandler, FunctionComponent, useEffect, useRef, useState } from 'react'
import { addClickOutsideListener } from '../../common/helpers'
import classNames from 'classnames'

export interface ClipboardProps {
  onPaste: (blob: Blob) => void
  onCopy: () => void
  onCut: () => void
  canCutOrCopy: boolean
  onPasteFromFile: ChangeEventHandler<HTMLInputElement>
}

export const Clipboard: FunctionComponent<ClipboardProps> = (props) => {
  const [clipboardWriteState, setClipboardWriteState] = useState<PermissionState | null>(null)
  const [clipboardReadState, setClipboardReadState] = useState<PermissionState | null>(null)

  const [isMenuShown, setIsMenuShown] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuRef.current) throw new Error('No menu in ref')
    return addClickOutsideListener(
      menuRef.current,
      () => setIsMenuShown(false)
    )
  })

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
      <section className="main-buttons" ref={menuRef}>
        <button
          className={'paste-button'}
          onClick={paste}>
        </button>
        <button
          className='hoverable options'
          onClick={() => setIsMenuShown((value) => !value)}>▾</button>
        <nav
          className={classNames('paste-options', { 'paste-options_active': isMenuShown }) }
          onClick={() => setIsMenuShown(false)}>
            <label>Paste from file
              <input type='file' accept='image/*' onChange={props.onPasteFromFile}></input>
            </label>
        </nav>
      </section>
      <section className="side-buttons">
        <button
          className='hoverable'
          disabled={[null, 'denied'].includes(clipboardWriteState) || !props.canCutOrCopy}
          onClick={props.onCut}>
          Cut
        </button>
        <button
          className='hoverable'
          disabled={[null, 'denied'].includes(clipboardWriteState) || !props.canCutOrCopy}
          onClick={props.onCopy}>
          Copy
        </button>
        <button
          className='hoverable'
          disabled={[null, 'denied'].includes(clipboardReadState)}
          onClick={paste}
          {...pasteDisabledMessage}>
          Paste
        </button>
      </section>
    </nav>
  )
}
