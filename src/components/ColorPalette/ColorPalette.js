import React from 'react'
import './ColorPalette.css'

const ColorPalette = props => (
  <div className='color-palette'>
    {props.children}
  </div>
)

export default ColorPalette
