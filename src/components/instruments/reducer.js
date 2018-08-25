import { types } from './actions'

const instrumentsReducer = (state = { instrument: 'pen' }, action) => {
  switch (action.type) {
    case types.CHANGE_INSTRUMENT:
      const {type, ...withoutType} = action
      return {...state, ...withoutType}
    default:
      return state
  }
}

export default instrumentsReducer
