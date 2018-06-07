import React, { Component } from 'react'
import './styles/NavBar.css'

import Colors from './Colors'
import Clipboard from './Clipboard'

class NavBar extends Component {
  render () {
    return (
      <nav className='navbar'>
        <section>
          <Clipboard />
          <footer>
            Буфер обмена
          </footer>
        </section>
        <section>
          <Colors />
          <footer>
            Цвета
          </footer>
        </section>
      </nav>
    )
  }
}

export default NavBar
