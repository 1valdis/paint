import { FunctionComponent, ReactElement } from 'react'

import './NavBarItem.css'

export interface NavBarItemProps {
  footer?: string
  children: ReactElement
}

export const NavBarItem: FunctionComponent<NavBarItemProps> = props => (
  <section className="navbar-item">
    {props.children}
    {props.footer ? <footer>{props.footer}</footer> : null}
  </section>
)
