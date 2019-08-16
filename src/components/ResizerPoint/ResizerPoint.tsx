import React, { Component, createRef, RefObject, CSSProperties } from 'react'
import './ResizerPoint.css'

export interface ResizerPointProps {
  outerStyle?: CSSProperties
  innerStyle?: CSSProperties
  className: string
  onResizeStart: (e: PointerEvent) => void
  onResizeMove: (e: PointerEvent) => void
  onResizeEnd: (e: PointerEvent) => void
  onResizeCancel: (e: Event) => void
}

class ResizerPoint extends Component<ResizerPointProps> {
  resizing = false

  preventContextMenu = false

  resizerElement: RefObject<HTMLDivElement> = createRef()

  render() {
    return (
      <div
        className={'resizer-outer ' + (this.props.className || '')}
        style={{ ...this.props.outerStyle }}
        ref={this.resizerElement}>
        <div className="resizer-inner" style={{ ...this.props.innerStyle }} />
      </div>
    )
  }

  componentDidMount() {
    document.addEventListener('pointerdown', this.handlePointerDown, {
      passive: true
    })
    document.addEventListener('pointermove', this.handlePointerMove, {
      passive: true
    })
    document.addEventListener('pointerup', this.handlePointerUp, {
      passive: true
    })
    document.addEventListener('pointercancel', this.handlePointerCancel, {
      passive: true
    })
    window.addEventListener('blur', this.handlePointerCancel, { passive: true })
    document.addEventListener('contextmenu', this.handleContextMenu)
    document.addEventListener('dragstart', this.handleDragStart)
  }

  componentWillUnmount() {
    document.removeEventListener('pointerdown', this.handlePointerDown)
    document.removeEventListener('pointermove', this.handlePointerMove)
    document.removeEventListener('pointerup', this.handlePointerUp)
    document.removeEventListener('pointercancel', this.handlePointerCancel)
    window.removeEventListener('blur', this.handlePointerCancel)
    document.removeEventListener('contextmenu', this.handleContextMenu)
    document.removeEventListener('dragstart', this.handleDragStart)
  }

  handlePointerDown = (e: PointerEvent) => {
    if (!this.resizerElement.current)
      throw new Error('The ref contains no resizer element')
    switch (e.button) {
      case 0:
        if (this.resizerElement.current.contains(e.target as Node | null)) {
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

  handlePointerUp = (e: PointerEvent) => {
    if (this.resizing) {
      this.props.onResizeEnd(e)
      this.resizing = false
    }
  }

  handlePointerMove = (e: PointerEvent) => {
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

  handlePointerCancel = (e: Event) => {
    if (this.resizing) {
      this.resizing = false
      this.props.onResizeCancel(e)
    }
  }

  handleDragStart = (e: Event) => {
    e.preventDefault()
  }

  handleContextMenu = (e: Event) => {
    if (this.preventContextMenu) {
      e.preventDefault()
      this.preventContextMenu = false
    }
  }
}

export default ResizerPoint
