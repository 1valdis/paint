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
