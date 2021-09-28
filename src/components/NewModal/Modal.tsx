import { FC } from 'react'
import { createPortal } from 'react-dom'

import './Modal.css'

export const Modal: FC = ({ children }) => {
  const root = document.getElementById('modal-root')
  if (!root) throw new Error('No modal root found')

  return createPortal(children, root)
}