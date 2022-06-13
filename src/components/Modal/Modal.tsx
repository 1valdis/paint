import { FunctionComponent, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

import './Modal.css'

export interface ModalProps {
  title?: string
  onClose: () => void
}

export const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({ onClose, title, children }) => {
  const root = document.getElementById('modal-root')
  if (!root) throw new Error('No modal root found')

  return createPortal(<div className='modal'>
    <div className='modal-contents'>
      {title ? <header className="modal-title">{title}</header> : null}
      <button className="modal-close-button" onClick={onClose} />
      {children}
    </div>
  </div>, root)
}
