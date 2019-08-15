import { ActionTypes } from '../actions'
import { AnyAction } from 'redux'

export const instrumentsReducer = (
  state: any | undefined = { instrument: 'pen' },
  action: AnyAction
) => {
  switch (action.type) {
    case ActionTypes.changeInstrument:
      const { type, ...withoutType } = action
      return { ...state, ...withoutType }
    default:
      return state
  }
}
