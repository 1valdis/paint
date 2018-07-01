import React, { Component } from 'react'
import './ResizerPoint.css'

class ResizerPoint extends Component {
  constructor (...args) {
    super(...args)
    this.resizing = false
    this.preventContextMenu = false
  }
  render () {
    return (
      <div
        className='resizer-outer'
        style={{ ...this.props.outerStyle }}
        ref='resizerElement'
      >
        <div className='resizer-inner' style={{ ...this.props.innerStyle }} />
      </div>
    )
  }
  componentDidMount () {
    document.addEventListener('pointerdown', this.handlePointerDown, {passive: true})
    document.addEventListener('pointermove', this.handlePointerMove, {passive: true})
    document.addEventListener('pointerup', this.handlePointerUp, {passive: true})
    document.addEventListener('pointercancel', this.handlePointerCancel, {passive: true})
    window.addEventListener('blur', this.handlePointerCancel, {passive: true})
    document.addEventListener('contextmenu', this.handleContextMenu)
    document.addEventListener('dragstart', this.handleDragStart)
  }
  componentWillUnmount () {
    document.removeEventListener('pointerdown', this.handlePointerDown, {passive: true})
    document.removeEventListener('pointermove', this.handlePointerMove, {passive: true})
    document.removeEventListener('pointerup', this.handlePointerUp, {passive: true})
    document.removeEventListener('pointercancel', this.handlePointerCancel, {passive: true})
    window.removeEventListener('blur', this.handlePointerCancel, {passive: true})
    document.removeEventListener('contextmenu', this.handleContextMenu)
    document.removeEventListener('dragstart', this.handleDragStart)
  }
  handlePointerDown = e => {
    switch (e.button) {
      case 0:
        if (this.refs.resizerElement.contains(e.target)) {
          this.resizing = true
          this.props.onResizeStart(e)
        }
        return
      case 2:
        this.resizing = false
        this.props.onResizeCancel(e)
        break
      default:
        break
    }
  }
  handlePointerUp = e => {
    if (this.resizing) {
      this.props.onResizeEnd(e)
      this.resizing = false
    }
  }
  handlePointerMove = e => {
    if (this.resizing) {
      switch (e.buttons) {
        case 1:
          this.props.onResizeMove(e)
          break
        case 2:
        case 3:
          this.resizing = false
          this.props.onResizeCancel(e)
          this.preventContextMenu = true
          break
        default:
          break
      }
    }
  }
  handlePointerCancel = e => {
    if (this.resizing) {
      this.resizing = false
      this.props.onResizeCancel(e)
    }
  }
  handleDragStart = e => {
    e.preventDefault()
  }
  handleContextMenu = e => {
    if (this.preventContextMenu) {
      e.preventDefault()
      this.preventContextMenu = false
    }
  }
}

export default ResizerPoint
