// export * from './types'
import { ChangeImageAction } from './image'
import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'
import { ChangeInstrumentAction } from './instruments'
export * from './colors'
export * from './app'
export * from './image'
export * from './instruments'

export type Action =
  | ChangeImageAction
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
  | ChangeInstrumentAction
