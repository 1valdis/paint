import React, { Component } from 'react'
import './styles/FileMenu.css'

import classNames from 'classnames'

import { addClickOutsideListener, removeClickOutsideListener } from '../helpers'

class FileMenu extends Component {
  constructor () {
    super()
    this.state = { open: false }
    this.clickOutsideListener = null
  }
  render () {
    return (
      <div
        ref='menu'
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
          <label className='file-menu-item'>
            Открыть
            <input
              type='file'
              className='file-menu-item'
              accept='image/*'
              onChange={(...args) => {
                this.props.onFileOpen(...args)
                this.setState({ open: false })
              }}
            />
          </label>
          <a href={this.props.downloadSrc} download='Твоя пикча.png' className='file-menu-item'>Сохранить</a>
        </nav>
      </div>
    )
  }
  componentDidMount () {
    this.clickOutsideListener = addClickOutsideListener(this.refs.menu, () =>
      this.setState({ open: false })
    )
  }
  componentWillUnmount () {
    removeClickOutsideListener(this.clickOutsideListener)
  }
}

export default FileMenu
