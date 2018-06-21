import React from 'react'
import './ColorPalette.css'

import { connect } from 'react-redux'

import Color from '../Color/Color'
import { selectColor } from './actions'

const ColorPalette = props => (
  <div className='color-palette'>
    {[
      ...props.colors.map((c, i) => (
        <Color
          value={c}
          active={i === props.selectedColor}
          onClick={() => props.onColorClick(i)}
          key={'color' + i}
          colorId={i}
        />
      )),
      ...new Array(30 - props.colors.length)
        .fill(undefined)
        .map((item, i) => <Color value={null} key={'undefinedcolor' + i} />)
    ]}
  </div>
)

const mapStateToProps = ({ colors }) => ({
  colors: colors.list,
  selectedColor: colors[colors.activeColor]
})
const mapDispatchToProps = dispatch => ({
  onColorClick: color => dispatch(selectColor(color))
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorPalette)
