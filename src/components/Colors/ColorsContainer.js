import React, { PureComponent } from 'react'

import { connect } from 'react-redux'

import ColorsComponent from './ColorsComponent'
import {
  changeActiveColor,
  selectColor,
  addColorFromInput
} from '../../actions/colors'

class ColorsContainer extends PureComponent {
  render() {
    return <ColorsComponent {...this.props} />
  }
}

const mapStateToProps = state => ({
  colors: state.colors.list,
  activeColor: state.colors.activeColor,
  primary: state.colors.primary,
  secondary: state.colors.secondary
})
const mapDispatchToProps = dispatch => ({
  onColorClick: index => dispatch(selectColor(index)),
  onActiveColorClick: activeColor => dispatch(changeActiveColor(activeColor)),
  onColorInputChange: e => dispatch(addColorFromInput(e))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorsContainer)
