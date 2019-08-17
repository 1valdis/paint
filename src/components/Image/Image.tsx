import React, { Component } from 'react'
import './Image.css'

import { connect } from 'react-redux'

import classNames from 'classnames'

import {
  selectInstrument,
  Action,
  Instruments,
  changeImage
} from '../../actions'

import { ThunkDispatch } from 'redux-thunk'
import { StoreState } from '../../reducers'

interface ImageProps {
  image: ImageData
  instrument: Instruments
  selection: any // todo fix
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
            disabled={!(this.props.selection && this.props.selection.coords)}>
            Cut
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
    if (!(this.props.selection && this.props.selection.coords)) {
      return
    }
    const newCanvas = document.createElement('canvas')
    const newCtx = newCanvas.getContext('2d')
    ;({
      width: newCanvas.width,
      height: newCanvas.height
    } = this.props.selection.coords)

    if (!newCtx) throw new Error("Couldn't acquire canvas context")
    newCtx.putImageData(this.props.image, 0, 0)
    this.props.changeImage(
      newCtx.getImageData(
        this.props.selection.coords.left,
        this.props.selection.coords.top,
        this.props.selection.coords.width,
        this.props.selection.coords.height
      )
    )
    this.props.selectInstrument(Instruments.selection)
  }
}

const mapStateToProps = (state: StoreState) => ({
  image: state.image.data,
  instrument: state.instruments.instrument,
  selection: state.instruments.selection
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  selectInstrument: (instrument: Instruments) =>
    dispatch(selectInstrument(instrument)),
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const Image = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Image)
