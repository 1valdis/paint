import React, { FunctionComponent } from 'react'

import './NavBarItem.css'

export interface NavBarItemProps {
  footer: string
  children: JSX.Element
}

export const NavBarItem: FunctionComponent<NavBarItemProps> = props => (
  <section className="navbar-item">
    {props.children}
    <footer>{props.footer}</footer>
  </section>
)
