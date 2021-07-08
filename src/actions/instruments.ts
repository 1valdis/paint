import { InstrumentStoreState } from '../reducers/instruments'

export interface ChangeInstrumentAction {
  type: 'changeInstrument'
  payload: Partial<InstrumentStoreState>
}

export type Instruments = InstrumentStoreState['selected']

export const changeInstrument = (
  instrumentData: Partial<InstrumentStoreState>
): ChangeInstrumentAction => {
  return {
    type: 'changeInstrument',
    payload: instrumentData
  }
}
