import { FC, PropsWithChildren } from 'react'

import './TopPanel.css'

export const TopPanel: FC<PropsWithChildren<{}>> = (props) => {
  return <div className='top-panel'>{props.children}</div>
}
