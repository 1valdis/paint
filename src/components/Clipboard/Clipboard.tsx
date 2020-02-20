import React from 'react'

import './Clipboard.css'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { StoreState } from '../../reducers'
import { Action, copy, pasteManually } from '../../actions'

export interface ClipboardProps {
  copyEnabled: boolean
  pasteEnabled: boolean
  onCut: () => void
  onCopy: () => void
  onPaste: () => void
}

const _Clipboard: React.FC<ClipboardProps> = (props): JSX.Element => {
  const pasteDisabledMessage = props.pasteEnabled
    ? {}
    : {
        title:
          'Unable to read from clipboard. Check that you have a newer browser version and access to clipboard is allowed on this page'
      }
  return (
    <nav className="clipboard">
      <button disabled={!props.copyEnabled} onClick={props.onCut}>
        Cut
      </button>
      <button disabled={!props.copyEnabled} onClick={props.onCopy}>
        Copy
      </button>
      <button
        disabled={!props.pasteEnabled}
        onClick={props.onPaste}
        {...pasteDisabledMessage}>
        Paste
      </button>
    </nav>
  )
}

const mapStateToProps = (state: StoreState) => ({
  copyEnabled: state.clipboard.write !== 'denied',
  pasteEnabled: state.clipboard.read !== 'denied'
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  onCut: () => dispatch(copy()),
  onCopy: () => dispatch(copy()),
  onPaste: () => dispatch(pasteManually())
})

export const Clipboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Clipboard)
