import { FunctionComponent } from 'react'

import { Color } from '../../../common/Color'

import './Dropper.css'
import { ModernEyedropper } from './ModernEyedropper'
import { Dropper } from './Dropper'

interface DropperProps {
  image: HTMLCanvasElement
  onColorSelected: (color: Color) => void
  switchInstrument: () => void
}

export const ModernOrFallbackDropper: FunctionComponent<DropperProps> = (props) => {
  if ('EyeDropper' in window) {
    return <ModernEyedropper
      onColorSelected={props.onColorSelected}
      switchInstrument={props.switchInstrument}
    ></ModernEyedropper>
  }
  return <Dropper image={props.image} onColorSelected={props.onColorSelected}></Dropper>
}
