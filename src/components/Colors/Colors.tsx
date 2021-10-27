import { FunctionComponent } from 'react'

import { ColorPalette } from './ColorPalette'
import { ColorSelection } from './ColorSelection'
import { ColorInput } from './ColorInput'
import { Color } from './Color'

import { rgbToHex } from '../../common/helpers'
import { Color as IColor } from '../../common/Color'

import './Colors.css'

export interface ColorsContainerProps {
  colors: IColor[]
  activeColor: 'primary' | 'secondary'
  primary: IColor
  secondary: IColor
  onColorClick: (colorIndex: number) => void
  onActiveColorClick: (activeColorType: 'primary' | 'secondary') => void
  onNewColorAdded: (color: IColor) => void
}

export const Colors: FunctionComponent<ColorsContainerProps> = (props) => {
  return (
    <div className="colors">
      <ColorSelection
        header="Color 1"
        color={props.primary}
        active={props.activeColor === 'primary'}
        onClick={() => props.onActiveColorClick('primary')}
      />
      <ColorSelection
        header="Color 2"
        color={props.secondary}
        active={props.activeColor === 'secondary'}
        onClick={() => props.onActiveColorClick('secondary')}
      />
      <ColorPalette>
        {[
          ...props.colors.map((c, i) => (
            <Color
              value={c}
              onClick={() => props.onColorClick(i)}
              key={'color' + i}
            />
          )),
          ...Array.from(
            { length: 30 - props.colors.length },
            (item, i) => <Color key={'undefinedcolor' + i} />
          )
        ]}
      </ColorPalette>
      <ColorInput
        onNewColorSelected={props.onNewColorAdded}
        value={rgbToHex(props[props.activeColor])}
      />
    </div>
  )
}
