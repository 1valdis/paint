import { types } from './actions'

const instrumentsReducer = (state = { instrument: 'pen' }, action) => {
  switch (action.type) {
    case types.CHANGE_INSTRUMENT:
      return { ...action, type: undefined }
    default:
      return state
  }
}

export default instrumentsReducer
