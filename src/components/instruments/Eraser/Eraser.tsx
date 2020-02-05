import React, {
  PureComponent,
  createRef,
  RefObject,
  PointerEvent as ReactPointerEvent
} from 'react'

import { connect } from 'react-redux'

import './Eraser.css'
import { bresenhamLine, getCanvasCoordsFromEvent } from '../../helpers'
import { Color, Action, changeImage } from '../../../actions'
import { StoreState } from '../../../reducers'
import { ThunkDispatch } from 'redux-thunk'

export interface EraserProps {
  color: Color
  imageData: ImageData
  changeImage: (imageData: ImageData) => void
  thickness: number // insert true one after thickness is made
}

class _Eraser extends PureComponent<EraserProps> {
  canvasRef: RefObject<HTMLCanvasElement> = createRef<HTMLCanvasElement>()

  ctx?: CanvasRenderingContext2D

  noCursorCtx: CanvasRenderingContext2D

  isDrawing: boolean = false

  prevX: number = 0

  prevY: number = 0

  preventContextMenu: boolean = false

  constructor(props: EraserProps) {
    super(props)
    const noCursorCanvas = document.createElement('canvas')
    const noCursorCtx = noCursorCanvas.getContext('2d')
    if (!noCursorCtx) throw new Error("Coudn't acquire context")
    this.noCursorCtx = noCursorCtx
  }

  render() {
    return (
      <canvas
        className="eraser-canvas"
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

  handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    this.isDrawing = true
    const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
    this.drawPoint(x, y)
    this.beginDrawing(x, y)
  }

  handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
    if (this.isDrawing && e.buttons !== 3) {
      this.continueDrawing(x, y)
    }
    this.updateCanvas(x, y)
  }

  handlePointerEnter = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (e.buttons === 1 && this.isDrawing) {
      const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
      this.continueDrawing(x, y)
    } else {
      this.isDrawing = false
    }
  }

  handlePointerLeave = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    if (this.isDrawing) {
      const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
      this.continueDrawing(x, y)
    }
    this.updateCanvas()
  }

  handleDocumentPointerUp = () => {
    if (this.isDrawing) {
      this.isDrawing = false
      this.endDrawing()
    }
  }

  handleDocumentPointerMove = (e: PointerEvent) => {
    if (!this.canvasRef.current) return
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
    const { r, g, b } = this.props.color
    this.ctx.fillStyle = `rgb(${r},${g},${b})`
    this.ctx.strokeStyle = 'black'
    this.noCursorCtx.fillStyle = `rgb(${r},${g},${b})`
    this.updateCanvasNoCursor()
    document.addEventListener('pointerup', this.handleDocumentPointerUp)
    document.addEventListener('pointermove', this.handleDocumentPointerMove)
    document.addEventListener('selectstart', this.handleDocumentSelectStart)
    document.addEventListener('contextmenu', this.handleDocumentContextMenu)
  }

  componentDidUpdate() {
    const { r, g, b } = this.props.color
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.ctx.fillStyle = `rgb(${r},${g},${b})`
    this.noCursorCtx.fillStyle = `rgb(${r},${g},${b})`
    this.updateCanvasNoCursor()
  }

  componentWillUnmount() {
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
    document.removeEventListener('pointermove', this.handleDocumentPointerMove)
    document.removeEventListener('selectstart', this.handleDocumentSelectStart)
    document.removeEventListener('contextmenu', this.handleDocumentContextMenu)
  }

  beginDrawing = (x: number, y: number) => {
    const { r, g, b } = this.props.color
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.ctx.fillStyle = `rgb(${r},${g},${b})`
    this.drawPoint(x, y)
    ;[this.prevX, this.prevY] = [x, y]
  }

  continueDrawing = (x: number, y: number) => {
    bresenhamLine(this.prevX, this.prevY, x, y, this.drawPoint)
    ;[this.prevX, this.prevY] = [x, y]
  }

  endDrawing = () => {
    this.props.changeImage(
      this.noCursorCtx.getImageData(
        0,
        0,
        this.noCursorCtx.canvas.width,
        this.noCursorCtx.canvas.height
      )
    )
  }

  cancelDrawing = () => {
    this.noCursorCtx.putImageData(this.props.imageData, 0, 0)
  }

  drawPoint = (x: number, y: number) => {
    if (this.noCursorCtx)
      this.noCursorCtx.fillRect(
        x - this.props.thickness / 2,
        y - this.props.thickness / 2,
        this.props.thickness,
        this.props.thickness
      )
  }

  updateCanvasNoCursor = () => {
    if (this.props.imageData != null) {
      ;[this.noCursorCtx.canvas.width, this.noCursorCtx.canvas.height] = [
        this.props.imageData.width,
        this.props.imageData.height
      ]
      const { r, g, b } = this.props.color
      this.noCursorCtx.fillStyle = `rgb(${r},${g},${b})`
      this.noCursorCtx.putImageData(this.props.imageData, 0, 0)
    }
  }

  updateCanvas = (x?: number, y?: number) => {
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.ctx.drawImage(this.noCursorCtx.canvas, 0, 0)
    if (x !== undefined && y !== undefined) {
      this.ctx.fillRect(
        x - this.props.thickness / 2,
        y - this.props.thickness / 2,
        this.props.thickness,
        this.props.thickness
      )
      this.ctx.strokeRect(
        x - this.props.thickness / 2 + 0.5,
        y - this.props.thickness / 2 + 0.5,
        this.props.thickness - 1,
        this.props.thickness - 1
      )
    }
  }
}

const mapStateToProps = (state: StoreState) => ({
  color: state.colors.list[state.colors.secondary],
  imageData: state.image.data,
  thickness: 8 // insert true one after thickness is made
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const Eraser = connect(mapStateToProps, mapDispatchToProps)(_Eraser)
