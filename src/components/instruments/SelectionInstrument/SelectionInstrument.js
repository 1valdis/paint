import React, { PureComponent, createRef } from 'react'

import { connect } from 'react-redux'

import ZoneSelection from './ZoneSelection/ZoneSelection'
import ImageDataSelection from './ImageDataSelection/ImageDataSelection'

import './SelectionInstrument.css'

import { changeSelection } from './actions'
import { changeImage } from '../../App/actions'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.

class SelectionInstrument extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = {
      selecting: false,
      selectingX: null,
      selectingY: null,
      selectingCoords: null
    }

    this.containerRef = createRef()

    // todo - imageData selection handling
  }

  render() {
    let El
    if (this.state.selecting && this.state.selectingCoords) {
      El = (
        <div
          className="selecting"
          style={{
            top: `${this.state.selectingCoords.top}px`,
            left: `${this.state.selectingCoords.left}px`,
            width: `${this.state.selectingCoords.width}px`,
            height: `${this.state.selectingCoords.height}px`
          }}
        />
      )
    } else if (this.props.selectionImageData) {
      El = (
        <ImageDataSelection
          onClickOutside={e => this.handlePointerDown(e, true)}
          imageData={this.props.imageData}
          coords={this.props.selectionCoords}
          selectionImageData={this.props.selectionImageData}
          onSelectionChanged={this.props.changeSelection}
          onImageChanged={imageData => this.props.changeImage(imageData)}
          secondaryColor={this.props.secondaryColor}
        />
      )
    } else if (this.props.selectionCoords) {
      El = (
        <ZoneSelection
          onClickOutside={e => this.handlePointerDown(e, true)}
          imageData={this.props.imageData}
          coords={this.props.selectionCoords}
          onCoordsChanged={zone =>
            this.props.changeSelection({ coords: zone, imageData: null })
          }
          onImageChanged={imageData => this.props.changeImage(imageData)}
          secondaryColor={this.props.secondaryColor}
        />
      )
    } else El = null
    return (
      <div
        className="selection"
        onPointerDown={this.handlePointerDown}
        ref={this.containerRef}>
        {El}
      </div>
    )
  }

  handlePointerDown = (e, trusted) => {
    if (e.target !== e.currentTarget && !trusted) return

    this.backgroundColor = null
    this.props.changeSelection({ coords: null, imageData: null })

    let {
      top,
      left,
      bottom,
      right
    } = this.containerRef.current.getBoundingClientRect()
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

    switch (e.buttons) {
      case 1:
        this.setState(state => {
          // getting bounding rect and mouse coords relatively to document, not viewport
          let {
            top,
            left,
            bottom,
            right
          } = this.containerRef.current.getBoundingClientRect()
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
            Math.max(
              0,
              Math.min(canvasRelativeTop, this.props.imageData.height)
            ),
            Math.max(
              0,
              Math.min(canvasRelativeLeft, this.props.imageData.width)
            )
          ]

          // console.log(canvasRelativeTop, canvasRelativeLeft)

          const selectingCoords = {
            top: Math.min(state.selectingY, canvasRelativeTop),
            left: Math.min(state.selectingX, canvasRelativeLeft),
            width: Math.max(
              Math.max(state.selectingX, canvasRelativeLeft) -
                Math.min(state.selectingX, canvasRelativeLeft),
              0
            ),
            height: Math.max(
              Math.max(state.selectingY, canvasRelativeTop) -
                Math.min(state.selectingY, canvasRelativeTop),
              0
            )
          }

          return {
            selectingCoords
          }
        })
        break
      case 2:
      case 3:
        this.setState({
          selecting: false,
          selectingX: null,
          selectingY: null,
          selectingCoords: null
        })
        this.preventContextMenu = true
        break // no default
    }
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
          this.props.changeSelection({
            coords: this.state.selectingCoords,
            imageData: null
          })
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

  componentDidMount() {
    document.addEventListener('pointermove', this.handleDocumentPointerMove, {
      passive: true
    })
    document.addEventListener('pointerup', this.handleDocumentPointerUp, {
      passive: true
    })
    document.addEventListener('contextmenu', this.handleContextMenu)
  }

  componentWillUnmount() {
    document.removeEventListener(
      'pointermove',
      this.handleDocumentPointerMove,
      { passive: true }
    )
    document.removeEventListener('pointerup', this.handleDocumentPointerUp, {
      passive: true
    })
    document.removeEventListener('contextmenu', this.handleContextMenu)
  }

  handleContextMenu = e => {
    if (this.preventContextMenu) {
      e.preventDefault()
      this.preventContextMenu = false
    }
  }
}

const mapStateToProps = state => ({
  imageData: state.image.data,
  selectionCoords: state.instruments.selection
    ? state.instruments.selection.coords
    : null,
  selectionImageData: state.instruments.selection
    ? state.instruments.selection.imageData
    : null,
  secondaryColor: state.colors.list[state.colors.secondary]
})
const mapDispatchToProps = dispatch => ({
  changeSelection: (zone, imageData) =>
    dispatch(changeSelection(zone, imageData)),
  changeImage: imageData => dispatch(changeImage(imageData))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionInstrument)
