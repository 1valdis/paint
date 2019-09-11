import { ActionTypes, Instruments, SelectionCoords } from '../actions'
import { AnyAction } from 'redux'

export interface OtherInstrumentStoreState {
  instrument: Instruments.pen |
    Instruments.dropper |
    Instruments.eraser |
    Instruments.fill |
    Instruments.text |
    Instruments.zoom
}

export interface SelectionStoreState {
  instrument: Instruments.selection,
  originalImageData?: ImageData,
  selectionImageData?: ImageData,
  coords?: SelectionCoords
}

export type InstrumentStoreState = OtherInstrumentStoreState | SelectionStoreState

export const instrumentsReducer = (
  state: InstrumentStoreState = { instrument: Instruments.pen },
  action: AnyAction
) => {
  switch (action.type) {
    case ActionTypes.changeInstrument:
      const { type, ...withoutType } = action
      return { ...state, ...withoutType }
    default:
      return state
  }
}
