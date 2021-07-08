import { Action, getInitialState } from '../actions'

export interface ClipboardStoreState {
  read: 'granted' | 'denied' | 'prompt'
  write: 'granted' | 'denied' | 'prompt'
}

export const clipboardReducer = (
  state: ClipboardStoreState = getInitialState().clipboard,
  action: Action
) => {
  if (action.type === 'clipboardPermissionChange') {
    console.log(action)
    return {
      ...state,
      ...action.payload
    }
  }
  return state
}
