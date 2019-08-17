import React, { PureComponent, ChangeEvent, ChangeEventHandler } from 'react'

import { connect } from 'react-redux'

import { ColorsComponent } from './ColorsComponent'
import {
  changeActiveColor,
  selectColor,
  addColorFromInput,
  SelectedColor,
  Color
} from '../../actions/colors'
import { StoreState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from '../../actions'

export interface ColorsContainerProps {
  colors: Color[]
  activeColor: SelectedColor
  primary: number
  secondary: number
  onColorClick: (colorIndex: number) => void
  onActiveColorClick: (activeColorType: SelectedColor) => void
  onColorInputChange: ChangeEventHandler<HTMLInputElement>
}

class _ColorsContainer extends PureComponent<ColorsContainerProps> {
  render() {
    return <ColorsComponent {...this.props} />
  }
}

const mapStateToProps = (state: StoreState) => ({
  colors: state.colors.list,
  activeColor: state.colors.activeColor,
  primary: state.colors.primary,
  secondary: state.colors.secondary
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  onColorClick: (index: number) => dispatch(selectColor(index)),
  onActiveColorClick: (activeColor: SelectedColor) =>
    dispatch(changeActiveColor(activeColor)),
  onColorInputChange: (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(addColorFromInput(e))
})

export const ColorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_ColorsContainer)
