import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Colors.css'

import { rgbToHex } from '../helpers'

import ColorPalette from '../ColorPalette/ColorPalette'
import ColorSelection from '../ColorSelection/ColorSelection'
import ColorInput from '../ColorInput/ColorInput'
import Color from '../Color/Color'

const ColorsComponent = props => (
  <div className='colors'>
    <ColorSelection
      header='Цвет 1'
      color={props.colors[props.primary]}
      active={props.activeColor === 'primary'}
      onClick={() => props.onActiveColorClick('primary')}
    />
    <ColorSelection
      header='Цвет 2'
      color={props.colors[props.secondary]}
      active={props.activeColor === 'secondary'}
      onClick={() => props.onActiveColorClick('secondary')}
    />
    <ColorPalette>
      {[
        ...props.colors.map((c, i) => (
          <Color
            value={c}
            active={i === props[props.activeColor]}
            onClick={() => props.onColorClick(i)}
            key={'color' + i}
            colorId={i}
          />
        )),
        ...new Array(30 - props.colors.length)
          .fill(undefined)
          .map((item, i) => (
            <Color
              value={null}
              key={'undefinedcolor' + i}
            />
          ))
      ]}
    </ColorPalette>
    <ColorInput
      onChange={props.onColorInputChange}
      value={rgbToHex(props.colors[props[props.activeColor]])}
    />
  </div>
)

ColorsComponent.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.shape({
    r: PropTypes.number.isRequired,
    g: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired
  })).isRequired,
  activeColor: PropTypes.oneOf(['primary', 'secondary']).isRequired,
  onColorClick: PropTypes.func.isRequired,
  onActiveColorClick: PropTypes.func.isRequired,
  onColorInputChange: PropTypes.func.isRequired
}

export default ColorsComponent
