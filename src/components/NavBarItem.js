import React from 'react'
import './styles/NavBarItem.css'

const NavBarItem = props => (
  <section className='navbar-item'>
    {props.children}
    <footer>
      {props.footer}
    </footer>
  </section>
)

export default NavBarItem
