import { PureComponent } from 'react'
import { createPortal } from 'react-dom'

import './Modal.css'

export interface ModalProps {}

export class Modal extends PureComponent<ModalProps> {
  element: Element

  static root = document.getElementById('modal-root')

  constructor(props: ModalProps) {
    super(props)
    this.element = document.createElement('div')
    this.element.classList.add('modal')
  }

  render() {
    return createPortal(this.props.children, this.element)
  }

  componentDidMount() {
    Modal.root && Modal.root.appendChild(this.element)
  }

  componentWillUnmount() {
    Modal.root && Modal.root.removeChild(this.element)
  }
}
