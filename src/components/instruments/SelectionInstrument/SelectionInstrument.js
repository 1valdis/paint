import React, { PureComponent } from 'react'

import { connect } from 'react-redux'

import MovableSelection from '../../MovableSelection/MovableSelection'

import './SelectionInstrument.css'

import { selection } from './actions'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.

class SelectionInstrument extends PureComponent {
  constructor (...args) {
    super(...args)
    this.state = {
      selecting: false,
      selectingX: null,
      selectingY: null,
      selectionCoords: null,
      selectionData: null
    }
  }
  render () {
    let El
    if (this.state.selecting && this.state.selectionCoords) {
      El = (
        <div
          className='selecting'
          style={{
            top: `${this.state.selectionCoords.top}px`,
            left: `${this.state.selectionCoords.left}px`,
            width: `${this.state.selectionCoords.width}px`,
            height: `${this.state.selectionCoords.height}px`
          }}
        />
      )
    } else if (this.props.selection) {
      El = <MovableSelection onChange={this.existingSelectionChangeHandler} {...this.props.selection} />
    } else El = null
    return (
      <div className='selection' onPointerDown={this.handlePointerDown}>
        {El}
      </div>
    )
  }
  handlePointerDown = e => {
    if (e.target !== e.currentTarget) return

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
    this.setState({ selecting: true, selectingY: top, selectingX: left })
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
        Math.max(
          0,
          Math.min(canvasRelativeTop, this.props.imageData.height)
        ),
        Math.max(
          0,
          Math.min(canvasRelativeLeft, this.props.imageData.width)
        )
      ]

      //console.log(canvasRelativeTop, canvasRelativeLeft)

      const selectionCoords = {
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

      // console.log(top + selectionCoords.top + selectionCoords.height, bottom)

      return {
        selectionCoords
      }
    })
  }
  handleDocumentPointerUp = e => {
    // also checking if user just clicked without moving (so there's no selectionCoords)
    if (this.state.selecting && this.state.selectionCoords) {
      if (this.state.selectionCoords.width > 0 && this.state.selectionCoords.height > 0)
      this.props.onSelect(this.state.selectionCoords)
      this.setState({
        selecting: false,
        selectingX: null,
        selectingY: null,
        selectionCoords: null
      })
    }
  }
  existingSelectionChangeHandler = (top, left, width, height) => {
    this.backgroundColor = this.props.secondaryColor
    this.props.onSelect({top, left, width, height})
  }
  componentDidMount () {
    document.addEventListener('pointermove', this.handleDocumentPointerMove)
    document.addEventListener('pointerup', this.handleDocumentPointerUp)
  }
  componentWillUnmount () {
    document.removeEventListener('pointermove', this.handleDocumentPointerMove)
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
  }
}

const mapStateToProps = state => ({
  imageData: state.image.data,
  selection: state.instruments.selection,
  secondaryColor: state.colors.list[state.colors.secondary]
})
const mapDispatchToProps = dispatch => ({
  onSelect: zone => dispatch(selection(zone))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionInstrument)
