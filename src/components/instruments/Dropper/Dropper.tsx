import React, { PureComponent, MouseEventHandler } from 'react'

import { connect } from 'react-redux'
import {
  addColor,
  changeInstrument,
  Action,
  Color,
  Instruments
} from '../../../actions'
import './Dropper.css'
import { ThunkDispatch } from 'redux-thunk'
import { StoreState } from '../../../reducers'

interface DropperProps {
  imageData: ImageData
  addColor: (color: Color) => void
  selectInstrument: (instrument: Instruments) => void
}

class _Dropper extends PureComponent<DropperProps> {
  render() {
    return (
      <div
        className="dropper"
        onClick={this.handleClick}
        style={{
          width: this.props.imageData.width,
          height: this.props.imageData.height
        }}
      />
    )
  }

  handleClick: MouseEventHandler = e => {
    if (!e.target || e.target !== e.currentTarget) return

    let {
      top,
      left,
      bottom,
      right
    } = (e.target as HTMLElement).getBoundingClientRect()
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

    const i = (top * this.props.imageData.width + left) * 4

    this.props.addColor({
      r: this.props.imageData.data[i],
      g: this.props.imageData.data[i + 1],
      b: this.props.imageData.data[i + 2]
    })
    this.props.selectInstrument(Instruments.pen)
  }
}

const mapStateToProps = (state: StoreState) => ({
  imageData: state.image.data
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  addColor: (color: Color) => dispatch(addColor(color)),
  selectInstrument: (instrument: Instruments) =>
    dispatch(changeInstrument({ instrument }))
})

export const Dropper = connect(mapStateToProps, mapDispatchToProps)(_Dropper)
