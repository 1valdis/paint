import React, { PureComponent, Fragment, createRef } from 'react'
import PropTypes from 'prop-types'

import MovableSelection from '../../../MovableSelection/MovableSelection'

class ZoneSelection extends PureComponent {
  constructor (...args) {
    super(...args)
    this.canvasRef = createRef()

    this.state = {
      originCoords: this.props.coords
    }
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
    const oldCanvas = document.createElement('canvas')
    oldCanvas.width = this.props.imageData.width
    oldCanvas.height = this.props.imageData.height
    this.oldCtx = oldCanvas.getContext('2d')
    this.oldCtx.putImageData(this.props.imageData, 0, 0)

    this.canvasRef.current.width = this.props.imageData.width
    this.canvasRef.current.height = this.props.imageData.height
    this.newCtx = this.canvasRef.current.getContext('2d')
    this.newCtx.imageSmoothingEnabled = false
  }

  handleResizing = ({ top, left, width, height }) => {}
  handleResizeEnd = ({ top, left, width, height }) => {
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
  handleMoving = ({ top, left, width, height }) => {
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.props.onCoordsChanged({ top, left, width, height })
  }
  handleMoveEnd = ({ top, left, width, height }) => {
    this.props.onImageChanged(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  redrawCanvas = updateOld => {
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

  componentDidUpdate (prevProps) {
    if (
      prevProps.imageData.width !== this.props.imageData.width ||
      prevProps.imageData.height !== this.props.imageData.height
    ) {
      this.props.onCoordsChanged(null)
    }
    this.redrawCanvas(false)
  }
}

ZoneSelection.propTypes = {
  coords: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  backgroundColor: PropTypes.shape({
    r: PropTypes.number.isRequired,
    g: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired
  }),
  imageData: PropTypes.instanceOf(ImageData).isRequired,
  onCoordsChanged: PropTypes.func.isRequired,
  onImageChanged: PropTypes.func.isRequired,
  onClickOutside: PropTypes.func.isRequired
}

export default ZoneSelection
