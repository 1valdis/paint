import { addPermissionChangeListeners } from './clipboard'
import { Middleware } from 'redux'

export const sideEvents: Middleware = api => {
  addPermissionChangeListeners(api.dispatch)
  return next => action => next(action)
}
