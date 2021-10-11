import { FunctionComponent } from 'react'

import './NavBar.css'

export const NavBar: FunctionComponent = props => (
  <nav className="navbar">{props.children}</nav>
)
