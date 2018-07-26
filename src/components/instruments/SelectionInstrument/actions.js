import { types } from '../actions'

export function selection (coords) {
  return {
    type: types.CHANGE_INSTRUMENT,
    instrument: 'selection',
    selection: {
      coords,
      imageData: null
    }
  }
}

export function paste (imageData) {
  return {
    type: types.CHANGE_INSTRUMENT,
    instrument: 'selection',
    selection: {
      coords: null,
      imageData
    }
  }
}