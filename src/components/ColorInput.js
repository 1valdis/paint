import React from 'react'
import './styles/ColorInput.css'

import icon from './images/color-input-icon.png'

const ColorInput = props => (
  <div className='color-input'>
    <label
      className='color-input-wrapper'
      style={{ backgroundImage: `url(${icon})` }}
    >
      <input type='color' {...props} />
    </label>
    <h6 className='color-input-header'>
      Изменение цветов
    </h6>
  </div>
)

export default ColorInput
