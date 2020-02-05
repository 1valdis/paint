import React, {
  PureComponent,
  Fragment,
  createRef,
  RefObject,
  PointerEvent as ReactPointerEvent
} from 'react'

import { MovableSelection } from '../../../MovableSelection/MovableSelection'
import { Color } from '../../../../actions'
import { SelectionCoords } from '../../../../reducers/instruments'

export interface ImageDataSelectionProps {
  imageData: ImageData
  coords: SelectionCoords
  selectionImageData: ImageData
  secondaryColor: Color
  changeSelection: (data: {
    coords?: SelectionCoords | null
    imageData?: ImageData | null
  }) => void
  changeImage: (imageData: ImageData) => void
  onClickOutside: (e: ReactPointerEvent<HTMLCanvasElement>) => void
}

export class ImageDataSelection extends PureComponent<ImageDataSelectionProps> {
  canvasRef: RefObject<HTMLCanvasElement> = createRef()

  oldCtx?: CanvasRenderingContext2D

  newCtx?: CanvasRenderingContext2D

  selectionCtx?: CanvasRenderingContext2D

  backgroundColor?: Color

  resized?: boolean

  updateOld?: boolean

  constructor(props: ImageDataSelectionProps) {
    super(props)

    this.canvasRef = createRef()

    if (
      this.props.imageData.width < this.props.selectionImageData.width ||
      this.props.imageData.height < this.props.selectionImageData.height
    ) {
      this.resized = true
      this.resizeCanvasToFitPasted()
      this.props.changeSelection({
        coords: this.props.coords,
        imageData: this.props.selectionImageData
      })
      this.updateOld = true
    }
  }

  render() {
    return (
      <Fragment>
        <canvas
          ref={this.canvasRef}
          onPointerDown={e =>
            e.target === e.currentTarget && this.props.onClickOutside(e)
          }
        />
        <MovableSelection
          {...this.props.coords}
          onResizing={this.handleResizing}
          onResizeEnd={this.handleResizeEnd}
          onMoving={this.handleMoving}
          onMoveEnd={this.handleMoveEnd}
          hideBorderOnResizing={false}
        />
      </Fragment>
    )
  }

  componentDidMount() {
    this.updateOldCanvas()
    this.updateSelectionCanvas()
    this.updateNewCanvas()
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    this.props.changeImage(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  componentDidUpdate(prevProps: ImageDataSelectionProps) {
    if (this.updateOld) {
      this.updateOldCanvas()
    }
    if (this.props.selectionImageData !== prevProps.selectionImageData) {
      this.updateSelectionCanvas()
    }
    this.updateNewCanvas()
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    if (this.resized) {
      this.resized = false
      this.props.changeImage(
        this.newCtx.getImageData(
          0,
          0,
          this.newCtx.canvas.width,
          this.newCtx.canvas.height
        )
      )
      this.updateOld = false
      return
    }
    this.updateOld = true
    if (this.props.selectionImageData !== prevProps.selectionImageData) {
      this.props.changeImage(
        this.newCtx.getImageData(
          0,
          0,
          this.newCtx.canvas.width,
          this.newCtx.canvas.height
        )
      )
    }
  }

  updateOldCanvas = () => {
    if (!this.oldCtx) {
      const oldCanvas = document.createElement('canvas')
      this.oldCtx = oldCanvas.getContext('2d') || undefined
    }
    if (!this.oldCtx) throw new Error("Coudn't acquire context")
    this.oldCtx.canvas.width = this.props.imageData.width
    this.oldCtx.canvas.height = this.props.imageData.height
    this.oldCtx.putImageData(this.props.imageData, 0, 0)
  }

  updateSelectionCanvas = () => {
    if (!this.selectionCtx) {
      const selectionCanvas = document.createElement('canvas')
      this.selectionCtx = selectionCanvas.getContext('2d') || undefined
    }
    if (!this.selectionCtx) throw new Error("Coudn't acquire context")
    this.selectionCtx.canvas.width = this.props.selectionImageData.width
    this.selectionCtx.canvas.height = this.props.selectionImageData.height
    this.selectionCtx.putImageData(this.props.selectionImageData, 0, 0)
  }

  updateNewCanvas = () => {
    if (!this.selectionCtx || !this.oldCtx)
      throw new Error("Coudn't acquire context")
    if (!this.newCtx) {
      if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
      this.canvasRef.current.width = this.oldCtx.canvas.width
      this.canvasRef.current.height = this.oldCtx.canvas.height
      this.newCtx = this.canvasRef.current.getContext('2d') || undefined
      if (!this.newCtx) throw new Error("Coudn't acquire context")
      this.newCtx.imageSmoothingEnabled = false
    }

    if (
      this.newCtx.canvas.width !== this.oldCtx.canvas.width ||
      this.newCtx.canvas.height !== this.oldCtx.canvas.height
    ) {
      this.newCtx.canvas.width = this.oldCtx.canvas.width
      this.newCtx.canvas.height = this.oldCtx.canvas.height
      this.newCtx.imageSmoothingEnabled = false
    }

    this.newCtx.drawImage(this.oldCtx.canvas, 0, 0)

    this.newCtx.drawImage(
      this.selectionCtx.canvas,
      0,
      0,
      this.selectionCtx.canvas.width,
      this.selectionCtx.canvas.height,
      this.props.coords.left,
      this.props.coords.top,
      this.props.coords.width,
      this.props.coords.height
    )
  }

  handleResizing = ({ top, left, width, height }: SelectionCoords) => {}

  handleResizeEnd = ({ top, left, width, height }: SelectionCoords) => {
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.updateOld = false
    this.props.changeSelection({
      coords: { top, left, width, height },
      imageData: this.props.selectionImageData
    })
    this.updateOld = false
    this.props.changeImage(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  handleMoving = ({ top, left, width, height }: SelectionCoords) => {
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      if (!this.newCtx) throw new Error("Coudn't acquire context")
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.updateOld = false
    this.props.changeSelection({
      coords: { top, left, width, height },
      imageData: this.props.selectionImageData
    })
  }

  handleMoveEnd = ({ top, left, width, height }: SelectionCoords) => {
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    this.updateOld = false
    this.props.changeImage(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  resizeCanvasToFitPasted = () => {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(
      this.props.imageData.width,
      this.props.selectionImageData.width
    )
    canvas.height = Math.max(
      this.props.imageData.height,
      this.props.selectionImageData.height
    )
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error("Coudn't acquire context")
    ctx.fillStyle = `rgb(${this.props.secondaryColor.r}, ${this.props.secondaryColor.g}, ${this.props.secondaryColor.b})`
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.putImageData(this.props.imageData, 0, 0)

    this.props.changeImage(
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    )
  }
}
