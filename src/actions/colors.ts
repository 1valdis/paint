import { ActionTypes } from './types'
import { ChangeEvent } from 'react'
import { ThunkAction } from 'redux-thunk'
import { StoreState } from '../reducers'

export interface Color {
  r: number
  g: number
  b: number
}

export enum SelectedColor {
  primary = 'primary',
  secondary = 'secondary'
}

export interface AddColorAction {
  type: ActionTypes.addColor
  value: Color
}

export interface SelectColorAction {
  type: ActionTypes.selectColor
  index: number
}

export interface ChangeSelectedColorAction {
  type: ActionTypes.changeActiveColor
  activeColor: SelectedColor
}

export const changeActiveColor = (
  activeColor: SelectedColor
): ChangeSelectedColorAction => {
  return {
    type: ActionTypes.changeActiveColor,
    activeColor
  }
}

export const addColorFromInput = (
  e: ChangeEvent<HTMLInputElement>
): ThunkAction<void, StoreState, undefined, AddColorAction> => {
  return (dispatch, getState): void => {
    const hexRgb = e.target.value.match(/[A-Za-z0-9]{2}/g)
    if (!hexRgb) return
    const rgb = hexRgb.map(v => parseInt(v, 16))
    const newColor: Color = { r: rgb[0], g: rgb[1], b: rgb[2] }
    const colors = getState().colors.list
    if (
      !colors.find(
        color =>
          color.r === newColor.r &&
          color.g === newColor.g &&
          color.b === newColor.b
      )
    ) {
      dispatch<AddColorAction>({
        type: ActionTypes.addColor,
        value: newColor
      })
    }
  }
}

export const addColor = (
  newColor: Color
): ThunkAction<
  void,
  StoreState,
  undefined,
  AddColorAction | SelectColorAction
> => {
  return (dispatch, getState) => {
    const colors = getState().colors.list
    const index = colors.findIndex(
      color =>
        color.r === newColor.r &&
        color.g === newColor.g &&
        color.b === newColor.b
    )
    if (index === -1) {
      dispatch<AddColorAction>({
        type: ActionTypes.addColor,
        value: newColor
      })
    } else {
      dispatch<SelectColorAction>(selectColor(index))
    }
  }
}

export const selectColor = (index: number): SelectColorAction => {
  return {
    type: ActionTypes.selectColor,
    index
  }
}
