import './Image.css'

import classNames from 'classnames'

import { FunctionComponent } from 'react'

export type Instrument =
| 'pen'
| 'fill'
| 'text'
| 'eraser'
| 'dropper'
| 'zoom'
| 'brushes'
| 'shapes'
| 'selection'

interface SelectionCoords {
  top: number
  left: number
  width: number
  height: number
}

interface ImageProps {
  image: HTMLCanvasElement
  instrument: Instrument
  selectionCoords?: SelectionCoords
  selectInstrument: (instrument: Instrument) => void
  changeImage: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void
}

export const Image: FunctionComponent<ImageProps> = (props) => {
  const handleClipClick = () => {
    if (!props.selectionCoords) {
      return
    }
    const newCanvas = document.createElement('canvas')
    const newCtx = newCanvas.getContext('2d')
    ;({
      width: newCanvas.width,
      height: newCanvas.height
    } = props.selectionCoords)

    if (!newCtx) throw new Error("Couldn't acquire canvas context")
    newCtx.drawImage(props.image, -props.selectionCoords.top, -props.selectionCoords.left)
    props.changeImage(newCanvas, newCtx)
    props.selectInstrument('selection')
  }

  return (
    <nav className="image">
      <button
        className={classNames('select', {
          select_active: props.instrument === 'selection'
        })}
        onClick={() => props.selectInstrument('selection')}>
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
          onClick={handleClipClick}
          disabled={!props.selectionCoords}>
          Crop
        </button>
        <button>Change size</button>
        <button>Rotate</button>
      </div>
    </nav>
  )
}

// const mapStateToProps = (state: StoreState) => ({
//   image: state.image.data,
//   instrument: state.instruments.instrument,
//   selectionCoords:
//     state.instruments.instrument === Instruments.selection
//       ? state.instruments.coords
//       : undefined
// })
// const mapDispatchToProps = (
//   dispatch: ThunkDispatch<StoreState, undefined, Action>
// ) => ({
//   selectInstrument: (instrument: Instruments) =>
//     dispatch(changeInstrument({ instrument })),
//   changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
// })
