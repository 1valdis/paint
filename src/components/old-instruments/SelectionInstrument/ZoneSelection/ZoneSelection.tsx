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

interface ZoneSelectionProps {
  coords: SelectionCoords
  secondaryColor: Color
  imageData: ImageData
  onCoordsChanged: (newCoords: SelectionCoords) => void
  onImageChanged: (newImageData: ImageData) => void
  onClickOutside: (e: ReactPointerEvent<HTMLCanvasElement>) => void
}

interface ZoneSelectionState {
  originCoords: SelectionCoords
}

export class ZoneSelection extends PureComponent<
  ZoneSelectionProps,
  ZoneSelectionState
> {
  canvasRef: RefObject<HTMLCanvasElement> = createRef()

  oldCtx?: CanvasRenderingContext2D

  newCtx?: CanvasRenderingContext2D

  backgroundColor?: Color

  constructor(props: ZoneSelectionProps) {
    super(props)

    this.state = {
      originCoords: this.props.coords
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
    const oldCanvas = document.createElement('canvas')
    oldCanvas.width = this.props.imageData.width
    oldCanvas.height = this.props.imageData.height
    this.oldCtx = oldCanvas.getContext('2d') || undefined
    if (!this.oldCtx) throw new Error("Coudn't acquire context")
    this.oldCtx.putImageData(this.props.imageData, 0, 0)

    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    this.canvasRef.current.width = this.props.imageData.width
    this.canvasRef.current.height = this.props.imageData.height
    this.newCtx = this.canvasRef.current.getContext('2d') || undefined

    if (!this.newCtx) throw new Error("Coudn't acquire context")
    this.newCtx.imageSmoothingEnabled = false
  }

  handleResizing = ({ top, left, width, height }: SelectionCoords) => {}

  handleResizeEnd = ({ top, left, width, height }: SelectionCoords) => {
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.props.onCoordsChanged({ top, left, width, height })
    this.props.onImageChanged(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  handleMoving = ({ top, left, width, height }: SelectionCoords) => {
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.props.onCoordsChanged({ top, left, width, height })
  }

  handleMoveEnd = ({ top, left, width, height }: SelectionCoords) => {
    if (!this.newCtx) throw new Error("Coudn't acquire context")
    this.props.onImageChanged(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  redrawCanvas = (updateOld: boolean) => {
    if (!this.newCtx || !this.oldCtx) throw new Error("Coudn't acquire context")
    if (updateOld) {
      this.oldCtx.canvas.width = this.props.imageData.width
      this.oldCtx.canvas.height = this.props.imageData.height
      this.newCtx.canvas.width = this.props.imageData.width
      this.newCtx.canvas.height = this.props.imageData.height
      this.newCtx.imageSmoothingEnabled = false
      this.oldCtx.putImageData(this.props.imageData, 0, 0)
    }

    this.newCtx.drawImage(this.oldCtx.canvas, 0, 0)

    if (this.props.coords && this.state.originCoords) {
      this.newCtx.fillRect(
        this.state.originCoords.left,
        this.state.originCoords.top,
        this.state.originCoords.width,
        this.state.originCoords.height
      )
      this.newCtx.drawImage(
        this.oldCtx.canvas,
        this.state.originCoords.left,
        this.state.originCoords.top,
        this.state.originCoords.width,
        this.state.originCoords.height,
        this.props.coords.left,
        this.props.coords.top,
        this.props.coords.width,
        this.props.coords.height
      )
    }
  }

  componentDidUpdate() {
    this.redrawCanvas(false)
  }
}
