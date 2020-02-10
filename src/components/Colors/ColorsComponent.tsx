import React, { ChangeEventHandler, FunctionComponent } from 'react'

import './Colors.css'

import { ColorPalette } from '../ColorPalette/ColorPalette'
import { ColorSelection } from '../ColorSelection/ColorSelection'
import { ColorInput } from '../ColorInput/ColorInput'
import { Color } from '../Color/Color'

import { rgbToHex } from '../helpers'
import { Color as ColorObject } from '../../actions'

export interface ColorsComponentProps {
  colors: ColorObject[]
  activeColor: 'primary' | 'secondary'
  onColorClick: (colorIndex: number) => void
  onActiveColorClick: (activeColorType: 'primary' | 'secondary') => void
  onColorInputChange: ChangeEventHandler
  primary: number
  secondary: number
}

export const ColorsComponent: FunctionComponent<ColorsComponentProps> = props => (
  <div className="colors">
    <ColorSelection
      header="Color 1"
      color={props.colors[props.primary]}
      active={props.activeColor === 'primary'}
      onClick={() => props.onActiveColorClick('primary')}
    />
    <ColorSelection
      header="Color 2"
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
          />
        )),
        ...new Array(30 - props.colors.length)
          .fill(undefined)
          .map((item, i) => <Color key={'undefinedcolor' + i} />)
      ]}
    </ColorPalette>
    <ColorInput
      onChange={props.onColorInputChange}
      value={rgbToHex(props.colors[props[props.activeColor]])}
    />
  </div>
)
