import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'
import { ChangeInstrumentAction } from './instruments'
import { ChangeImageAction } from './app'

export type Action =
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
  | ChangeInstrumentAction
  | ChangeImageAction
