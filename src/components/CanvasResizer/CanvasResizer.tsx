import React, { PureComponent } from 'react'
import { Resizer } from '../Resizer/Resizer'
import { StoreState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { changeImage, Action } from '../../actions'
import { connect } from 'react-redux'

export interface CanvasResizerProps {
  imageData: ImageData
  secondaryColor: { r: number; g: number; b: number }
  changeImage(imageData: ImageData): void
}

class _CanvasResizer extends PureComponent<CanvasResizerProps> {
  render() {
    return (
      <Resizer
        mode="canvas"
        onResizeEnd={this.onResize}
        // onResizing={() =>
        //   changeInstrument({ instrument: this.props.selectedInstrument })
        // }
        width={this.props.imageData.width}
        height={this.props.imageData.height}
        top={0}
        left={0}
      />
    )
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
      newCtx.fillStyle = `rgb(${this.props.secondaryColor.r},${this.props.secondaryColor.g},${this.props.secondaryColor.b})`
      newCtx.fillRect(0, 0, toWidth, toHeight)
      newCtx.putImageData(this.props.imageData, 0, 0)
      this.props.changeImage(newCtx.getImageData(0, 0, toWidth, toHeight))
    }
  }
}

const mapStateToProps = (state: StoreState) => ({
  imageData: state.image.imageData,
  secondaryColor: state.colors.list[state.colors.secondary]
  // selectedInstrument: state.instruments.instrument
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
  // changeInstrument: (instrumentData: InstrumentStoreState) =>
  //   dispatch(changeInstrument(instrumentData))
})

export const CanvasResizer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_CanvasResizer)
