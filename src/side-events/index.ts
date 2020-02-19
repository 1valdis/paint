import { addPermissionChangeListeners } from './clipboard'
import { Action } from '../actions'

export const applySideEventListeners = (dispatch: (action: Action) => void) => {
  addPermissionChangeListeners(dispatch)
}
