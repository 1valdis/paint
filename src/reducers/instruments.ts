import { ActionTypes, Instruments } from '../actions'
import { AnyAction } from 'redux'

export interface OtherInstrumentStoreState {
  instrument:
    | Instruments.pen
    | Instruments.dropper
    | Instruments.eraser
    | Instruments.fill
    | Instruments.text
    | Instruments.zoom
}

export interface SelectionCoords {
  left: number
  top: number
  width: number
  height: number
}

export interface SelectionStoreState {
  instrument: Instruments.selection
  originalImageData?: ImageData
  selectionImageData?: ImageData
  coords?: SelectionCoords
}

export type InstrumentStoreState =
  | OtherInstrumentStoreState
  | SelectionStoreState

export const instrumentsReducer = (
  state: InstrumentStoreState = { instrument: Instruments.pen },
  action: AnyAction
): InstrumentStoreState => {
  switch (action.type) {
    case ActionTypes.changeInstrument:
      return action.instrumentData
    default:
      return state
  }
}
