import { FunctionComponent, PropsWithChildren } from 'react'

import './ColorPalette.css'

export const ColorPalette: FunctionComponent<PropsWithChildren<{}>> = (props) => (
  <div className="color-palette">{props.children}</div>
)
