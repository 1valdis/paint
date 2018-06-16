import React, { Component } from 'react'
import './styles/Resizer.css'

class Resizer extends Component {
  constructor (...args) {
    super(...args)
    this.resizing = false
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
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('dragstart', this.handleDragStart)
  }
  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('dragstart', this.handleDragStart)
  }
  handleMouseDown = e => {
    if (this.refs.resizerElement.contains(e.target)){
      this.resizing=true
      this.props.onResizeStart(e)
    }
  }
  handleMouseUp = e => {
    if (this.resizing){
      this.props.onResizeEnd(e)
      this.resizing=false
    }
  }
  handleMouseMove = e => {
    if (this.resizing){
      this.props.onResizeMove(e)
    }
  }
  handleDragStart = e => {
    e.preventDefault()
  }
}

export default Resizer
