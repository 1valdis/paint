import { PureComponent } from 'react'
import { createPortal } from 'react-dom'

import './Modal.css'

const root = document.getElementById('modal-root')

class Modal extends PureComponent {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this.el.classList.add('modal')
  }
  render () {
    return createPortal(this.props.children, this.el)
  }
  componentDidMount () {
    root.appendChild(this.el)
  }
  componentWillUnmount () {
    root.removeChild(this.el)
  }
}

export default Modal
