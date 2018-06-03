import React, { Component } from 'react'
import './styles/NavBar.css'

import Colors from './Colors'

class NavBar extends Component {
  render () {
    return (
      <nav className='navbar'>
        <Colors />
      </nav>
    )
  }
}

export default NavBar
