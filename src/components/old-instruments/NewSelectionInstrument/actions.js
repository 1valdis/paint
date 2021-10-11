import { types } from '../actions'

export function createSelectionFromCoords(originCoords) {
  return function(dispatch, getState) {
    const imageData = getState().image.data
    return {
      type: types.CHANGE_INSTRUMENT,
      instrument: 'selection',
      selection: {
        imageData: imageData
      }
    }
  }
}

export function disableSelection() {
  return {
    type: types.CHANGE_INSTRUMENT,
    selection: {
      coords: null,
      imageData: null
    }
  }
}
