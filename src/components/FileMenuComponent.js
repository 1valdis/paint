import React, { PureComponent } from 'react'
import './styles/FileMenu.css'

import classNames from 'classnames'

import { addClickOutsideListener, removeClickOutsideListener } from '../helpers'

class FileMenuComponent extends PureComponent {
  render () {
    return (
      <div
        ref='menu'
        className={classNames('file-menu', {
          'file-menu_open': this.props.isOpen
        })}
      >
        <button className='file-menu-button' onClick={this.props.onClick}>
          Файл
        </button>
        <nav className='file-menu-items' onClick={this.props.onClickInside}>
          <button className='file-menu-item' onClick={this.props.onFileCreate}>
            Создать
          </button>
          <label className='file-menu-item'>
            Открыть
            <input
              type='file'
              className='file-menu-item'
              accept='image/*'
              onChange={this.props.onFileOpen}
            />
          </label>
          <a
            href={this.props.downloadSrc}
            download='Твоя пикча.png'
            className='file-menu-item'
          >
            Сохранить
          </a>
        </nav>
      </div>
    )
  }
  componentDidMount () {
    this.clickOutsideListener = addClickOutsideListener(
      this.refs.menu,
      this.props.onClickOutside
    )
  }
  componentWillUnmount () {
    removeClickOutsideListener(this.clickOutsideListener)
  }
}

export default FileMenuComponent
