import { ActionTypes } from './types'

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
  instrument: Instruments
}

export const selectInstrument = (
  instrument: Instruments
): ChangeInstrumentAction => {
  return {
    type: ActionTypes.changeInstrument,
    instrument
  }
}
