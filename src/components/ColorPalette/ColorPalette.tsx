import React, { FunctionComponent } from 'react'

import './ColorPalette.css'

export const ColorPalette: FunctionComponent = (props): JSX.Element => (
  <div className="color-palette">{props.children}</div>
)
