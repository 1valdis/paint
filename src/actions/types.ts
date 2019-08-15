import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'
import { ChangeInstrumentAction } from './instruments'
import { ChangeImageAction } from './app'

export enum ActionTypes {
  addColor,
  selectColor,
  changeActiveColor,
  changeInstrument,
  changeImage
}

export type Action =
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
  | ChangeInstrumentAction
  | ChangeImageAction
