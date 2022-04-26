import { FunctionComponent } from 'react'

import { Color } from '../../common/Color'

import './ColorInput.css'

export interface ColorInputProps {
  onNewColorSelected: (color: Color) => void
  value: string
}

export const ColorInput: FunctionComponent<ColorInputProps> = (
  props
) => (
  <div className="color-input">
    <label className="color-input-wrapper">
      <input type="color" onChange={(event) => {
        const hexRgb = event.target.value.match(/[A-Za-z0-9]{2}/g)
        if (!hexRgb) return
        const rgb = hexRgb.map(v => parseInt(v, 16)) as [number, number, number]
        const newColor = { r: rgb[0], g: rgb[1], b: rgb[2] }
        props.onNewColorSelected(newColor)
      }} value={props.value} />
    </label>
    <h6 className="color-input-header">Change color</h6>
  </div>
)
