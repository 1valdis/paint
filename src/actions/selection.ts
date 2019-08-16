import { ActionTypes } from '.'
import { ChangeInstrumentAction, Instruments } from './instruments'

export interface SelectionCoords {
  left: number
  top: number
  width: number
  height: number
}

export const changeSelection = ({
  coords,
  imageData
}: {
  coords: SelectionCoords
  imageData: ImageData
}): ChangeInstrumentAction => {
  return {
    type: ActionTypes.changeInstrument,
    instrument: Instruments.selection,
    selection: {
      coords,
      imageData
    }
  }
}

export const disableSelection = (): ChangeInstrumentAction => {
  return {
    type: ActionTypes.changeInstrument,
    selection: null
  }
}
