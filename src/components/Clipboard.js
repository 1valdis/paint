import React, { Component } from 'react'
import './styles/Clipboard.css'

class Clipboard extends Component {
  render () {
    return (
      <nav className='clipboard'>
        <button disabled={this.props.disabled}>Вырезать</button>
        <button disabled={this.props.disabled}>Копировать</button>
      </nav>
    )
  }
}

export default Clipboard
