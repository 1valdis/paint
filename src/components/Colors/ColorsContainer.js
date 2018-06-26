import React, { Component } from 'react'
import './Colors.css'

import { connect } from 'react-redux'

import ColorsComponent from './ColorsComponent'
import { changeActiveColor, selectColor, addColor } from './actions'

class ColorsContainer extends Component {
  constructor () {
    super()
    this.state = {
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 127, g: 127, b: 127 },
        { r: 136, g: 0, b: 21 },
        { r: 237, g: 28, b: 36 },
        { r: 255, g: 127, b: 39 },
        { r: 255, g: 242, b: 0 },
        { r: 34, g: 177, b: 76 },
        { r: 0, g: 162, b: 232 },
        { r: 63, g: 72, b: 204 },
        { r: 163, g: 73, b: 164 },
        { r: 255, g: 255, b: 255 },
        { r: 195, g: 195, b: 195 },
        { r: 185, g: 122, b: 87 },
        { r: 255, g: 174, b: 201 },
        { r: 255, g: 201, b: 14 },
        { r: 239, g: 228, b: 176 },
        { r: 181, g: 230, b: 29 },
        { r: 153, g: 217, b: 234 },
        { r: 112, g: 176, b: 190 },
        { r: 200, g: 191, b: 231 }
      ],
      activeColor: 'primary',
      colorSelections: {
        primary: 0,
        secondary: 10
      }
    }
  }
  render () {
    return <ColorsComponent {...this.props} />
  }
  customColorSelected = e => {
    
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
  onColorInputChange: e => dispatch(addColor(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorsContainer)
