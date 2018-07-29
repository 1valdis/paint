import React, { PureComponent, Fragment, createRef } from 'react'
import PropTypes from 'prop-types'

import MovableSelection from '../../../MovableSelection/MovableSelection'

class ImageDataSelection extends PureComponent {
  constructor (...args) {
    super(...args)

    this.canvasRef = createRef()

    if (
      this.props.imageData.width < this.props.selectionImageData.width ||
      this.props.imageData.height < this.props.selectionImageData.height
    ) {
      this.resizeCanvasToFitPasted()
      this.props.onSelectionChanged({
        coords: this.props.coords,
        imageData: this.props.selectionImageData
      })
      this.updateOld = true
    }
    console.log('constructor')
  }

  render () {
    return (
      <Fragment>
        <canvas
          ref={this.canvasRef}
          onPointerDown={e =>
            e.target === e.currentTarget && this.props.onClickOutside(e)}
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

  componentDidMount () {
    this.updateOldCanvas()
    this.updateSelectionCanvas()
    this.updateNewCanvas()
    console.log('mount')
  }

  componentDidUpdate (prevProps) {
    if (this.updateOld) {
      this.updateOldCanvas()
    }
    if (this.props.selectionImageData !== prevProps.selectionImageData) {
      this.updateSelectionCanvas()
    }
    this.updateNewCanvas()
    this.updateOld = true
  }

  updateOldCanvas = () => {
    if (!this.oldCtx) {
      const oldCanvas = document.createElement('canvas')
      this.oldCtx = oldCanvas.getContext('2d')
    }
    this.oldCtx.canvas.width = this.props.imageData.width
    this.oldCtx.canvas.height = this.props.imageData.height
    this.oldCtx.putImageData(this.props.imageData, 0, 0)
  }

  updateSelectionCanvas = () => {
    if (!this.selectionCtx) {
      const selectionCanvas = document.createElement('canvas')
      this.selectionCtx = selectionCanvas.getContext('2d')
    }
    this.selectionCtx.canvas.width = this.props.selectionImageData.width
    this.selectionCtx.canvas.height = this.props.selectionImageData.height
    this.selectionCtx.putImageData(this.props.selectionImageData, 0, 0)
  }

  updateNewCanvas = () => {
    if (!this.newCtx) {
      this.canvasRef.current.width = this.oldCtx.canvas.width
      this.canvasRef.current.height = this.oldCtx.canvas.height
      this.newCtx = this.canvasRef.current.getContext('2d')
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

  handleResizing = ({ top, left, width, height }) => {}
  handleResizeEnd = ({ top, left, width, height }) => {
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.updateOld = false
    this.props.onSelectionChanged({
      coords: { top, left, width, height },
      imageData: this.props.selectionImageData
    })
    this.updateOld = false
    this.props.onImageChanged(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }
  handleMoving = ({ top, left, width, height }) => {
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.updateOld = false
    this.props.onSelectionChanged({
      coords: { top, left, width, height },
      imageData: this.props.selectionImageData
    })
  }
  handleMoveEnd = ({ top, left, width, height }) => {
    this.updateOld = false
    this.props.onImageChanged(
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

    ctx.fillStyle = `rgb(${this.props.secondaryColor.r}, ${this.props.secondaryColor.g}, ${this.props.secondaryColor.b})`
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.putImageData(this.props.imageData, 0, 0)

    this.props.onImageChanged(
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    )
  }
}

ImageDataSelection.propTypes = {
  coords: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  selectionImageData: PropTypes.instanceOf(ImageData).isRequired,
  backgroundColor: PropTypes.shape({
    r: PropTypes.number.isRequired,
    g: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired
  }),
  imageData: PropTypes.instanceOf(ImageData).isRequired,
  onSelectionChanged: PropTypes.func.isRequired,
  onImageChanged: PropTypes.func.isRequired,
  onClickOutside: PropTypes.func.isRequired
}

export default ImageDataSelection
