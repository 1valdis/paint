export const types = {
  CHANGE_INSTRUMENT: 'instruments/change'
}

export function selectInstrument (instrument) {
  return {
    type: types.CHANGE_INSTRUMENT,
    instrument
  }
}
