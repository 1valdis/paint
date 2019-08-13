import React, { FunctionComponent } from 'react'

import './Clipboard.css'

export const Clipboard: FunctionComponent = (): JSX.Element => (
  <nav className="clipboard">
    <button disabled={false}>Вырезать</button>
    <button disabled={false}>Копировать</button>
    <button disabled={false}>Вставить</button>
  </nav>
)