import React, { PureComponent, createRef } from 'react'

import { connect } from 'react-redux'

import './Pen.css'
import { bresenhamLine } from '../../helpers'
import { changeImage } from '../../App/actions'

class Pen extends PureComponent {
  constructor (...args) {
    super(...args)
    this.isDrawing = false
    this.leftWhileDrawing = false
    this.prevX = 0
    this.prevY = 0
    this.canvasRef = createRef()
    this.ctx = undefined
  }
  render () {
    return (
      <canvas
        className='pen-canvas'
        ref={this.canvasRef}
        width={this.props.width}
        height={this.props.height}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
        onPointerMove={this.handlePointerMove}
        onPointerEnter={this.handlePointerEnter}
        onPointerLeave={this.handlePointerLeave}
      />
    )
  }
  handlePointerDown = e => {
    this.isDrawing = true
    this.beginDrawing(...this.getCoordsFromEvent(e))
  }
  handlePointerMove = e => {
    if (this.isDrawing && e.buttons !== 3) {
      this.continueDrawing(...this.getCoordsFromEvent(e))
    }
  }
  handlePointerEnter = e => {
    if (e.buttons === 1 && this.isDrawing) {
      this.continueDrawing(...this.getCoordsFromEvent(e))
    } else {
      this.isDrawing = false
    }
  }
  handlePointerLeave = e => {
    if (this.isDrawing) {
      this.continueDrawing(...this.getCoordsFromEvent(e))
    }
  }
  handleDocumentPointerUp = () => {
    if (this.isDrawing) {
      this.isDrawing = false
      this.endDrawing()
    }
  }
  handleDocumentPointerMove = e => {
    if (e.target !== this.canvasRef.current) {
      [this.prevX, this.prevY] = this.getCoordsFromEvent(e)
    }
    if (this.isDrawing && e.button===2) {
      this.preventContextMenu = true
      this.cancelDrawing()
    }
  }
  handleDocumentContextMenu = e => {
    if (this.isDrawing){
      e.preventDefault()
      this.isDrawing = false
    }
  }
  handleDocumentSelectStart = e => {
    if (this.isDrawing){
      e.preventDefault()
    }
  }
  componentDidMount () {
    this.ctx = this.canvasRef.current.getContext('2d')
    document.addEventListener('pointerup', this.handleDocumentPointerUp)
    document.addEventListener('pointermove', this.handleDocumentPointerMove)
    document.addEventListener('selectstart', this.handleDocumentSelectStart)
    document.addEventListener('contextmenu', this.handleDocumentContextMenu)
  }
  componentWillUnmount () {
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
    document.removeEventListener('pointermove', this.handleDocumentPointerMove)
    document.removeEventListener('selectstart', this.handleDocumentSelectStart)
    document.removeEventListener('contextmenu', this.handleDocumentContextMenu)
  }
  componentDidUpdate () {
    if (this.props.imageData != null) {
      this.ctx.putImageData(this.props.imageData, 0, 0)
    }
  }
  beginDrawing = (x, y) => {
    const { r, g, b } = this.props.color
    this.ctx.fillStyle = `rgb(${r},${g},${b})`
    ;[this.prevX, this.prevY] = [x, y]
  }
  continueDrawing = (x, y) => {
    bresenhamLine(this.prevX, this.prevY, x, y, this.drawPoint)
    ;[this.prevX, this.prevY] = [x, y]
  }
  endDrawing = () => {
    // debugger
    this.props.dispatch(changeImage(this.ctx.getImageData(0, 0, this.canvasRef.current.width, this.canvasRef.current.height)))
  }
  cancelDrawing = () => {
    this.ctx.putImageData(this.props.imageData, 0, 0)
  }
  drawPoint = (x, y) => {
    this.ctx.fillRect(x, y, 1, 1)
  }

  getCoordsFromEvent (e) {
    let { top, left } = this.canvasRef.current.getBoundingClientRect()
    const [mouseX, mouseY] = [e.clientX, e.clientY]
    return [Math.floor(mouseX - left), Math.floor(mouseY - top)]
  }
}

const mapStateToProps = state => ({
  width: state.image.data ? state.image.data.width : 1,
  height: state.image.data ? state.image.data.height : 1,
  color: state.colors.list[state.colors[state.colors.activeColor]],
  imageData: state.image.data
})

export default connect(mapStateToProps)(Pen)
