import React from 'react'
import './ColorPalette.css'

import Color from './Color'

const ColorPalette = props => (
  <div className='color-palette'>
    {[
      ...props.colors.map((c, i) => (
        <Color
          value={c}
          active={i === props.activeColor}
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

export default ColorPalette
