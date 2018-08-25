import { types } from '../actions'

export function changeSelection ({coords, imageData}) {
  return {
    type: types.CHANGE_INSTRUMENT,
    instrument: 'selection',
    selection: {
      coords,
      imageData
    }
  }
}

export function disableSelection () {
  return {
    type: types.CHANGE_INSTRUMENT,
    selection: {
      coords: null,
      imageData: null
    }
  }
}
