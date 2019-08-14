import {
  AddColorAction,
  SelectColorAction,
  ChangeSelectedColorAction
} from './colors'

export enum ActionTypes {
  addColor,
  selectColor,
  changeActiveColor
}

export type Action =
  | AddColorAction
  | SelectColorAction
  | ChangeSelectedColorAction
