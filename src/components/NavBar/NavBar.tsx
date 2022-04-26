import { FunctionComponent, PropsWithChildren } from 'react'

import './NavBar.css'

export const NavBar: FunctionComponent<PropsWithChildren<{}>> = (props) => (
  <nav className="navbar">{props.children}</nav>
)
