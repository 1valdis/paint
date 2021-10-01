import { ChangeEventHandler, FunctionComponent } from 'react'

import { ColorPalette } from './ColorPalette'
import { ColorSelection } from './ColorSelection'
import { ColorInput } from './ColorInput'
import { Color } from './Color'

import { rgbToHex } from '../helpers'

import './Colors.css'

export interface ColorsContainerProps {
  colors: { r: number, g: number, b: number }[]
  activeColor: 'primary' | 'secondary'
  primary: number
  secondary: number
  onColorClick: (colorIndex: number) => void
  onActiveColorClick: (activeColorType: 'primary' | 'secondary') => void
  onColorInputChange: ChangeEventHandler<HTMLInputElement>
}

export const Colors: FunctionComponent<ColorsContainerProps> = (props) => {
  return (
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
            .map((item, i) => <Color key={'undefinedcolor' + i} />)
        ]}
      </ColorPalette>
      <ColorInput
        onChange={props.onColorInputChange}
        value={rgbToHex(props.colors[props[props.activeColor]])}
      />
    </div>
  )
}
