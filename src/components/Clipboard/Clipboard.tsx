import React, { FunctionComponent } from 'react'

import './Clipboard.css'

export const Clipboard: FunctionComponent = (): JSX.Element => (
  <nav className="clipboard">
    <button disabled={false}>Cut</button>
    <button disabled={false}>Copy</button>
    <button disabled={false}>Paste</button>
  </nav>
)
