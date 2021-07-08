import React, {
  PureComponent,
  createRef,
  RefObject,
  PointerEvent as ReactPointerEvent
} from 'react'

import { connect } from 'react-redux'

import './Pen.css'
import { bresenhamLine, getCanvasCoordsFromEvent } from '../../helpers'
import { changeImage, Color, Action } from '../../../actions'

import { ThunkDispatch } from 'redux-thunk'
import { StoreState } from '../../../reducers'

export interface PenProps {
  color: Color
  imageData: ImageData
  changeImage: (imageData: ImageData) => void
}

class _Pen extends PureComponent<PenProps> {
  canvasRef: RefObject<HTMLCanvasElement> = createRef<HTMLCanvasElement>()

  ctx?: CanvasRenderingContext2D

  isDrawing: boolean = false

  prevX: number = 0

  prevY: number = 0

  preventContextMenu: boolean = false

  render() {
    return (
      <canvas
        className="pen-canvas"
        ref={this.canvasRef}
        width={this.props.imageData ? this.props.imageData.width : 0}
        height={this.props.imageData ? this.props.imageData.height : 0}
        onPointerDown={this.handlePointerDown}
        onPointerMove={this.handlePointerMove}
        onPointerEnter={this.handlePointerEnter}
        onPointerLeave={this.handlePointerLeave}
      />
    )
  }

  handlePointerDown = (e: ReactPointerEvent) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    this.isDrawing = true
    const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
    this.beginDrawing(x, y)
  }

  handlePointerMove = (e: ReactPointerEvent) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (this.isDrawing && e.buttons !== 3) {
      const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
      this.continueDrawing(x, y)
    }
  }

  handlePointerEnter = (e: ReactPointerEvent) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (e.buttons === 1 && this.isDrawing) {
      const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
      this.continueDrawing(x, y)
    } else {
      this.isDrawing = false
    }
  }

  handlePointerLeave = (e: ReactPointerEvent) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (this.isDrawing) {
      const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
      this.continueDrawing(x, y)
    }
  }

  handleDocumentPointerUp = () => {
    if (this.isDrawing) {
      this.isDrawing = false
      this.endDrawing()
    }
  }

  handleDocumentPointerMove = (e: PointerEvent) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (e.target !== this.canvasRef.current) {
      ;[this.prevX, this.prevY] = getCanvasCoordsFromEvent(
        this.canvasRef.current,
        e
      )
    }
    if (this.isDrawing && e.button === 2) {
      this.preventContextMenu = true
      this.cancelDrawing()
    }
  }

  handleDocumentContextMenu = (e: Event) => {
    if (this.isDrawing) {
      e.preventDefault()
      this.isDrawing = false
    }
  }

  handleDocumentSelectStart = (e: Event) => {
    if (this.isDrawing) {
      e.preventDefault()
    }
  }

  componentDidMount() {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    this.ctx = this.canvasRef.current.getContext('2d') || undefined
    if (!this.ctx) throw new Error("Coudn't acquire context")
    if (this.props.imageData != null) {
      this.ctx.putImageData(this.props.imageData, 0, 0)
    }
    document.addEventListener('pointerup', this.handleDocumentPointerUp)
    document.addEventListener('pointermove', this.handleDocumentPointerMove)
    document.addEventListener('selectstart', this.handleDocumentSelectStart)
    document.addEventListener('contextmenu', this.handleDocumentContextMenu)
  }

  componentWillUnmount() {
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
    document.removeEventListener('pointermove', this.handleDocumentPointerMove)
    document.removeEventListener('selectstart', this.handleDocumentSelectStart)
    document.removeEventListener('contextmenu', this.handleDocumentContextMenu)
  }

  componentDidUpdate() {
    if (!this.ctx) throw new Error("Coudn't acquire context")
    if (this.props.imageData != null) {
      this.ctx.putImageData(this.props.imageData, 0, 0)
    }
  }

  beginDrawing = (x: number, y: number) => {
    if (!this.ctx) throw new Error("Coudn't acquire context")
    const { r, g, b } = this.props.color
    this.ctx.fillStyle = `rgb(${r},${g},${b})`
    this.ctx.fillRect(x, y, 1, 1)
    ;[this.prevX, this.prevY] = [x, y]
  }

  continueDrawing = (x: number, y: number) => {
    bresenhamLine(this.prevX, this.prevY, x, y, this.drawPoint)
    ;[this.prevX, this.prevY] = [x, y]
  }

  endDrawing = () => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.props.changeImage(
      this.ctx.getImageData(
        0,
        0,
        this.canvasRef.current.width,
        this.canvasRef.current.height
      )
    )
  }

  cancelDrawing = () => {
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.ctx.putImageData(this.props.imageData, 0, 0)
  }

  drawPoint = (x: number, y: number) => {
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.ctx.fillRect(x, y, 1, 1)
  }
}

const mapStateToProps = (state: StoreState) => ({
  color: state.colors.list[state.colors.primary],
  imageData: state.image.imageData
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const Pen = connect(mapStateToProps, mapDispatchToProps)(_Pen)
