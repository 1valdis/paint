import React, { Component } from 'react'
import './styles/Clipboard.css'

class Clipboard extends Component {
  render () {
    return (
      <nav className='clipboard'>
        <button>Вставить</button>
        <button>Вырезать</button>
        <button>Копировать</button>
      </nav>
    )
  }
}

export default Clipboard
