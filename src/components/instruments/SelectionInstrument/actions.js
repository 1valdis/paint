import { ActionTypes } from '../../../actions'

export function changeSelection({ coords, imageData }) {
  return {
    type: ActionTypes.changeInstrument,
    instrument: 'selection',
    selection: {
      coords,
      imageData
    }
  }
}

export function disableSelection() {
  return {
    type: ActionTypes.changeInstrument,
    selection: {
      coords: null,
      imageData: null
    }
  }
}
