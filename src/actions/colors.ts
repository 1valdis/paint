import { ChangeEvent } from 'react'
import { ThunkAction } from 'redux-thunk'
import { StoreState } from '../reducers'

export interface Color {
  r: number
  g: number
  b: number
}

export interface AddColorAction {
  type: 'addColor'
  payload: {
    value: Color
  }
}

export interface SelectColorAction {
  type: 'selectColor'
  payload: {
    index: number
  }
}

export interface ChangeSelectedColorAction {
  type: 'changeActiveColor'
  payload: {
    activeColor: 'primary' | 'secondary'
  }
}

export const changeActiveColor = (
  activeColor: 'primary' | 'secondary'
): ChangeSelectedColorAction => {
  return {
    type: 'changeActiveColor',
    payload: {
      activeColor
    }
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
        type: 'addColor',
        payload: {
          value: newColor
        }
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
        type: 'addColor',
        payload: {
          value: newColor
        }
      })
    } else {
      dispatch<SelectColorAction>(selectColor(index))
    }
  }
}

export const selectColor = (index: number): SelectColorAction => {
  return {
    type: 'selectColor',
    payload: {
      index
    }
  }
}
