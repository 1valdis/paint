import React, { PureComponent, createRef } from 'react'

import { connect } from 'react-redux'

import MovableSelection from '../../MovableSelection/MovableSelection'

import './SelectionInstrument.css'

import { selection } from './actions'
import { changeImage } from '../../App/actions'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.
// TODO: changing image only at the end of movement and resizing,
// but not WHILE mowing

class SelectionInstrument extends PureComponent {
  constructor (...args) {
    super(...args)

    this.state = {
      selecting: false,
      selectingX: null,
      selectingY: null,
      selectingCoords: null,
      selectionOriginCoords: this.props.selectionCoords
    }

    // todo - imageData selection handling

    this.canvasRef = createRef()
  }
  render () {
    let El
    if (this.state.selecting && this.state.selectingCoords) {
      El = (
        <div
          className='selecting'
          style={{
            top: `${this.state.selectingCoords.top}px`,
            left: `${this.state.selectingCoords.left}px`,
            width: `${this.state.selectingCoords.width}px`,
            height: `${this.state.selectingCoords.height}px`
          }}
        />
      )
    } else if (this.props.selectionCoords) {
      El = (
        <MovableSelection
          onResizing={this.handleResizing}
          onResizeEnd={this.handleResizeEnd}
          onMoving={this.handleMoving}
          onMoveEnd={this.handleMoveEnd}
          hideBorderOnResizing={false}
          {...this.props.selectionCoords}
        />
      )
    } else El = null
    return (
      <div className='selection' onPointerDown={this.handlePointerDown}>
        <canvas ref={this.canvasRef} />
        {El}
      </div>
    )
  }
  handlePointerDown = e => {
    if (e.target !== this.canvasRef.current) return

    this.oldCtx.putImageData(this.props.imageData, 0, 0)
    this.backgroundColor = null
    this.props.onSelect(null)
    this.container = e.target

    let { top, left, bottom, right } = e.target.getBoundingClientRect()
    ;[top, left, bottom, right] = [
      top + window.pageYOffset,
      left + window.pageXOffset,
      bottom + window.pageYOffset,
      right + window.pageXOffset
    ]
    const [mouseX, mouseY] = [
      e.clientX + window.pageXOffset,
      e.clientY + window.pageYOffset
    ]
    ;[top, left] = [Math.ceil(mouseY - top), Math.ceil(mouseX - left)]
    this.setState({
      selecting: true,
      selectingY: top,
      selectingX: left,
      selectingCoords: null
    })
  }
  handleDocumentPointerMove = e => {
    if (!this.state.selecting) return

    this.setState(state => {
      // getting bounding rect and mouse coords relatively to document, not viewport
      let { top, left, bottom, right } = this.container.getBoundingClientRect()
      ;[top, left, bottom, right] = [
        top + window.pageYOffset,
        left + window.pageXOffset,
        bottom + window.pageYOffset,
        right + window.pageXOffset
      ]
      const [mouseX, mouseY] = [
        e.clientX + window.pageXOffset,
        e.clientY + window.pageYOffset
      ]

      // getting top and left coordinates of current mouse position relatively to canvas
      let [canvasRelativeTop, canvasRelativeLeft] = [
        Math.trunc(mouseY - top),
        Math.trunc(mouseX - left)
      ]
      // clamping top and left coordinates between 0 and canvas width
      //
      ;[canvasRelativeTop, canvasRelativeLeft] = [
        Math.max(0, Math.min(canvasRelativeTop, this.props.imageData.height)),
        Math.max(0, Math.min(canvasRelativeLeft, this.props.imageData.width))
      ]

      // console.log(canvasRelativeTop, canvasRelativeLeft)

      const selectingCoords = {
        top: Math.min(state.selectingY, canvasRelativeTop),
        left: Math.min(state.selectingX, canvasRelativeLeft),
        width: Math.max(
          Math.max(state.selectingX, canvasRelativeLeft) -
            Math.min(state.selectingX, canvasRelativeLeft),
          1
        ),
        height: Math.max(
          Math.max(state.selectingY, canvasRelativeTop) -
            Math.min(state.selectingY, canvasRelativeTop),
          1
        )
      }

      return {
        selectingCoords
      }
    })
  }
  handleDocumentPointerUp = e => {
    this.setState(state => {
      let selectionOriginCoords = null
      // also checking if user just clicked without moving (so there's no selectionCoords)
      if (state.selecting && this.state.selectingCoords) {
        if (
          this.state.selectingCoords.width > 0 &&
          this.state.selectingCoords.height > 0
        ) {
          this.props.onSelect(this.state.selectingCoords)
          selectionOriginCoords = this.state.selectingCoords
        }
        return {
          selecting: false,
          selectingX: null,
          selectingY: null,
          selectingCoords: null,
          selectionOriginCoords
        }
      } else {
        return {
          selecting: false,
          selectingX: null,
          selectingY: null
        }
      }
    })
  }
  handleResizing = ({ top, left, width, height }) => {}
  handleResizeEnd = ({ top, left, width, height }) => {
    if (!this.backgroundColor) {
      this.backgroundColor = this.props.secondaryColor
      this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
    }
    this.props.onSelect({ top, left, width, height })
    this.props.changeImage(
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
    this.props.onSelect({ top, left, width, height })
  }
  handleMoveEnd = ({ top, left, width, height }) => {
    this.props.changeImage(
      this.newCtx.getImageData(
        0,
        0,
        this.newCtx.canvas.width,
        this.newCtx.canvas.height
      )
    )
  }

  redrawCanvas = updateOld => {
    if (!this.oldCtx) {
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

    if (updateOld) {
      this.oldCtx.canvas.width = this.props.imageData.width
      this.oldCtx.canvas.height = this.props.imageData.height
      this.newCtx.canvas.width = this.props.imageData.width
      this.newCtx.canvas.height = this.props.imageData.height
      this.newCtx.imageSmoothingEnabled = false
      this.oldCtx.putImageData(this.props.imageData, 0, 0)
    }

    this.newCtx.drawImage(this.oldCtx.canvas, 0, 0)

    if (this.props.selectionCoords && this.state.selectionOriginCoords) {
      this.newCtx.fillRect(
        this.state.selectionOriginCoords.left,
        this.state.selectionOriginCoords.top,
        this.state.selectionOriginCoords.width,
        this.state.selectionOriginCoords.height
      )
      this.newCtx.drawImage(
        this.oldCtx.canvas,
        this.state.selectionOriginCoords.left,
        this.state.selectionOriginCoords.top,
        this.state.selectionOriginCoords.width,
        this.state.selectionOriginCoords.height,
        this.props.selectionCoords.left,
        this.props.selectionCoords.top,
        this.props.selectionCoords.width,
        this.props.selectionCoords.height
      )
    }
    // todo: imageData
  }

  componentDidMount () {
    document.addEventListener('pointermove', this.handleDocumentPointerMove)
    document.addEventListener('pointerup', this.handleDocumentPointerUp)
    this.redrawCanvas(true)
  }
  componentWillUnmount () {
    document.removeEventListener('pointermove', this.handleDocumentPointerMove)
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
  }
  componentDidUpdate (prevProps) {
    if (
      prevProps.imageData.width !== this.props.imageData.width ||
      prevProps.imageData.height !== this.props.imageData.height
    ) {
      this.props.onSelect(null)
      this.redrawCanvas(true)
    }
    this.redrawCanvas(false)
  }
}

const mapStateToProps = state => ({
  imageData: state.image.data,
  selectionCoords: state.instruments.selection
    ? state.instruments.selection.coords
    : null,
  /* selectionImageData: state.instruments.selection.imageData, */
  secondaryColor: state.colors.list[state.colors.secondary]
})
const mapDispatchToProps = dispatch => ({
  onSelect: zone => dispatch(selection(zone)),
  changeImage: imageData => dispatch(changeImage(imageData))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionInstrument)
