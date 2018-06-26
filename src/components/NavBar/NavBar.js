import React, { Component } from 'react'

import './NavBar.css'

import NavBarItem from './NavBarItem'

class NavBar extends Component {
  render () {
    return (
      <nav className='navbar'>
        {this.props.children.map((c, i) => (
          <NavBarItem footer={c.props.footer} key={`navbaritem${i}`}>
            {c}
          </NavBarItem>
        ))}
      </nav>
    )
  }
}

export default NavBar
