import { clipboard, ClipboardPermissionChangeAction } from '../actions'

export const addPermissionChangeListeners = (
  dispatch: (action: ClipboardPermissionChangeAction) => void
) => {
  clipboard.onReadPermissionChange = permissionState =>
    dispatch({
      type: 'clipboardPermissionChange',
      payload: {
        read: permissionState
      }
    })
  clipboard.onWritePermissionChange = permissionState =>
    dispatch({
      type: 'clipboardPermissionChange',
      payload: {
        write: permissionState
      }
    })
}
