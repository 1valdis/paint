import { FunctionComponent } from 'react'

import './ColorPalette.css'

export const ColorPalette: FunctionComponent = (props) => (
  <div className="color-palette">{props.children}</div>
)
