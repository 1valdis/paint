// export * from './types'
// export * from './instruments'
import { ChangeImageAction } from './image'
import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'
export * from './colors'

export * from './app'
export * from './image'

export type Action =
  | ChangeImageAction
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
