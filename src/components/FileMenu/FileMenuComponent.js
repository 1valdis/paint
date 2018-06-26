import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './FileMenu.css'

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
          <button
            className='file-menu-item'
            onClick={this.props.onFileCreate}
          >
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
            href={this.props.downloadHref}
            download={this.props.downloadName}
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

FileMenuComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onClickInside: PropTypes.func.isRequired,
  onClickOutside: PropTypes.func.isRequired,
  downloadHref: PropTypes.string,
  downloadName: PropTypes.string,
  onFileCreate: PropTypes.func.isRequired,
  onFileOpen: PropTypes.func.isRequired
}

export default FileMenuComponent
