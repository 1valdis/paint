import React from 'react'
import PropTypes from 'prop-types'

import icon from './color-input-icon.png'

import './ColorInput.css'

const ColorInput = props => (
  <div className='color-input'>
    <label
      className='color-input-wrapper'
      style={{ backgroundImage: `url(${icon})` }}
    >
      <input type='color' onChange={props.onChange} value={props.value} />
    </label>
    <h6 className='color-input-header'>
      Изменение цветов
    </h6>
  </div>
)

ColorInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default ColorInput
