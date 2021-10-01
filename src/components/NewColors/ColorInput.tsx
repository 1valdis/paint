import { ChangeEventHandler, FunctionComponent } from 'react'

import './ColorInput.css'

export interface ColorInputProps {
  onChange: ChangeEventHandler
  value: string
}

export const ColorInput: FunctionComponent<ColorInputProps> = (
  props
) => (
  <div className="color-input">
    <label className="color-input-wrapper">
      <input type="color" onChange={props.onChange} value={props.value} />
    </label>
    <h6 className="color-input-header">Change color</h6>
  </div>
)
