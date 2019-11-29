import { ActionTypes } from './types'
import { InstrumentStoreState } from '../reducers/instruments'

export enum Instruments {
  pen = 'pen',
  fill = 'fill',
  text = 'text',
  eraser = 'eraser',
  dropper = 'dropper',
  zoom = 'zoom',
  selection = 'selection'
}

export interface ChangeInstrumentAction {
  type: ActionTypes.changeInstrument
  instrumentData: InstrumentStoreState
}

export const changeInstrument = (
  instrumentData: InstrumentStoreState
): ChangeInstrumentAction => {
  return {
    type: ActionTypes.changeInstrument,
    instrumentData
  }
}
