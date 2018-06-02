import React, { Component } from 'react'
import './styles/FileMenu.css'

import classNames from 'classnames'

import { onClickOutside } from '../helpers'

class FileMenu extends Component {
  constructor () {
    super()
    this.state = { open: false }
  }
  render () {
    return (
      <div ref='menu'
        className={classNames('file-menu', {
          'file-menu_open': this.state.open
        })}
      >
        <button
          className='file-menu-button'
          onClick={() =>
            this.setState(prevState => ({ open: !prevState.open }))}
        >
          Файл
        </button>
        <nav className='file-menu-items'>
          <button className='file-menu-item'>Создать</button>
          <button className='file-menu-item'>Открыть</button>
          <button className='file-menu-item'>Сохранить</button>
        </nav>
      </div>
    )
  }
  componentDidMount(){
    onClickOutside(this.refs.menu, ()=>this.setState({open: false})) 
  }
  toggleMenu = () => {
    
  }
}

export default FileMenu
