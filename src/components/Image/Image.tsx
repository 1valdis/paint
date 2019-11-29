import React, { Component } from 'react'
import './Image.css'

import { connect } from 'react-redux'

import classNames from 'classnames'

import {
  changeInstrument,
  Action,
  Instruments,
  changeImage,
} from '../../actions'

import { ThunkDispatch } from 'redux-thunk'
import { StoreState } from '../../reducers'
import { SelectionCoords } from '../../reducers/instruments'

interface ImageProps {
  image: ImageData
  instrument: Instruments,
  selectionCoords?: SelectionCoords
  selectInstrument: (instrument: Instruments) => void
  changeImage: (imageData: ImageData) => void
}

class _Image extends Component<ImageProps> {
  render() {
    return (
      <nav className="image">
        <button
          className={classNames('select', {
            select_active: this.props.instrument === 'selection'
          })}
          onClick={this.handleClick}>
          <svg viewBox="0 0 15 10">
            <rect
              width="15"
              height="10"
              style={{
                fill: 'transparent',
                strokeWidth: '1',
                strokeDasharray: '1',
                stroke: 'black'
              }}
            />
          </svg>
          <footer>Select</footer>
        </button>
        <div className="side-buttons">
          <button
            onClick={this.handleClipClick}
            disabled={!this.props.selectionCoords}>
            Crop
          </button>
          <button>Change size</button>
          <button>Rotate</button>
        </div>
      </nav>
    )
  }

  handleClick = () => {
    this.props.selectInstrument(Instruments.selection)
  }

  handleClipClick = () => {
    if (!this.props.selectionCoords) {
      return
    }
    const newCanvas = document.createElement('canvas')
    const newCtx = newCanvas.getContext('2d')
    ;({
      width: newCanvas.width,
      height: newCanvas.height
    } = this.props.selectionCoords)

    if (!newCtx) throw new Error("Couldn't acquire canvas context")
    newCtx.putImageData(this.props.image, 0, 0)
    this.props.changeImage(
      newCtx.getImageData(
        this.props.selectionCoords.left,
        this.props.selectionCoords.top,
        this.props.selectionCoords.width,
        this.props.selectionCoords.height
      )
    )
    this.props.selectInstrument(Instruments.selection)
  }
}

const mapStateToProps = (state: StoreState) => ({
  image: state.image.data,
  instrument: state.instruments.instrument,
  selectionCoords: state.instruments.instrument === Instruments.selection ? state.instruments.coords : undefined
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  selectInstrument: (instrument: Instruments) =>
    dispatch(changeInstrument({instrument})),
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const Image = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Image)
