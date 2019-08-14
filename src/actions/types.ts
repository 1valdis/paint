import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'
import { ChangeInstrumentAction } from './instruments'

export enum ActionTypes {
  addColor,
  selectColor,
  changeActiveColor,
  changeInstrument
}

export type Action =
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
  | ChangeInstrumentAction
