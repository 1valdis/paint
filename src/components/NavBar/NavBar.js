import React, { Component } from 'react'
import './NavBar.css'

import NavBarItem from './NavBarItem'

class NavBar extends Component {
  render () {
    return (
      <nav className='navbar'>
        {this.props.children.map(c => (
          <NavBarItem footer={c.props.footer}>
            {c}
          </NavBarItem>
        ))}
      </nav>
    )
  }
}

export default NavBar
