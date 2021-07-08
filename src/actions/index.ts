import { ChangeImageAction } from './image'
import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'
import { ChangeInstrumentAction } from './instruments'
import { ClipboardPermissionChangeAction } from './clipboard'
export * from './colors'
export * from './app'
export * from './image'
export * from './instruments'
export * from './clipboard'

export type Action =
  | ChangeImageAction
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
  | ChangeInstrumentAction
  | ClipboardPermissionChangeAction
