import { types } from '../actions'

export function selection (zone) {
  return {
    type: types.CHANGE_INSTRUMENT,
    instrument: 'selection',
    selection: zone
  }
}
