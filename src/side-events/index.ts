import { addPermissionChangeListeners } from './clipboard'
import { Middleware } from 'redux'

export const sideEvents: Middleware = ({ dispatch }) => {
  addPermissionChangeListeners(dispatch)
  return next => action => next(action)
}
