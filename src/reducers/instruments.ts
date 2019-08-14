import { ActionTypes, Action } from '../actions'

export const instrumentsReducer = (
  state = { instrument: 'pen' },
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.changeInstrument:
      const { type, ...withoutType } = action
      return { ...state, ...withoutType }
    default:
      return state
  }
}
