import React, { Component } from 'react'

import './Clipboard.css'

class Clipboard extends Component {
  render () {
    return (
      <nav className='clipboard'>
        <button disabled={false}>Вырезать</button>
        <button disabled={false}>Копировать</button>
        <button disabled={false}>Вставить</button>
      </nav>
    )
  }
}

export default Clipboard
