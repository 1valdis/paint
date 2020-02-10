import React, { PureComponent, createRef, RefObject } from 'react'

import { connect } from 'react-redux'

import {
  changeImage,
  // Color,
  Action
  // changeInstrument,
  // Instruments
} from '../../actions'

import { Resizer, ResizerMode } from '../Resizer/Resizer'
// import { CanvasEditor } from '../CanvasEditor/CanvasEditor'

import './Canvas.css'
import { StoreState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
// import { InstrumentStoreState } from '../../reducers/instruments'

export interface CanvasProps {
  imageData: ImageData
  changeImage: (imageData: ImageData) => void
}

class _Canvas extends PureComponent<CanvasProps> {
  canvas: RefObject<HTMLCanvasElement> = createRef()

  render() {
    return (
      <div className="canvas-wrapper">
        <canvas
          ref={this.canvas}
          className="canvas"
          width={this.props.imageData ? this.props.imageData.width : 0}
          height={this.props.imageData ? this.props.imageData.height : 0}
        />
        <div
          className="canvas-upper-layer"
          style={{
            width: this.props.imageData ? this.props.imageData.width : 0,
            height: this.props.imageData ? this.props.imageData.height : 0
          }}>
          <Resizer
            mode={ResizerMode.canvas}
            onResizeEnd={this.onResize}
            // onResizing={() =>
            //   changeInstrument({ instrument: this.props.selectedInstrument })
            // }
            width={this.props.imageData ? this.props.imageData.width : 0}
            height={this.props.imageData ? this.props.imageData.height : 0}
            top={0}
            left={0}
          />
          {/* <CanvasEditor /> */}
        </div>
      </div>
    )
  }

  updateCanvas = () => {
    const canvas = this.canvas.current
    if (canvas != null && this.props.imageData != null) {
      ;[canvas.width, canvas.height] = [
        this.props.imageData.width,
        this.props.imageData.height
      ]
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error("Coudn't acquire context")
      ctx.putImageData(this.props.imageData, 0, 0)
    }
  }

  onResize = (top: number, left: number, toWidth: number, toHeight: number) => {
    if (
      this.props.imageData.width !== toWidth ||
      this.props.imageData.height !== toHeight
    ) {
      const newCanvas = document.createElement('canvas')
      newCanvas.width = toWidth
      newCanvas.height = toHeight
      const newCtx = newCanvas.getContext('2d')
      if (!newCtx) throw new Error("Coudn't acquire context")
      // newCtx.fillStyle = `rgb(${this.props.secondaryColor.r},${this.props.secondaryColor.g},${this.props.secondaryColor.b})`
      newCtx.fillRect(0, 0, toWidth, toHeight)
      newCtx.putImageData(this.props.imageData, 0, 0)
      this.props.changeImage(newCtx.getImageData(0, 0, toWidth, toHeight))
    }
  }

  componentDidMount() {
    this.updateCanvas()
  }

  componentDidUpdate() {
    this.updateCanvas()
  }
}

const mapStateToProps = (state: StoreState) => ({
  imageData: state.image.imageData
  // secondaryColor: state.colors.list[state.colors.secondary],
  // selectedInstrument: state.instruments.instrument
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
  // changeInstrument: (instrumentData: InstrumentStoreState) =>
  //   dispatch(changeInstrument(instrumentData))
})

export const Canvas = connect(mapStateToProps, mapDispatchToProps)(_Canvas)
