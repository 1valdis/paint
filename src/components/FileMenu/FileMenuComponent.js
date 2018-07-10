import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './FileMenu.css'

import classNames from 'classnames'

import { addClickOutsideListener, removeClickOutsideListener } from '../helpers'

import Modal from '../Modal/Modal'
import About from './about/About'

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
          <button
            className='file-menu-item'
            onClick={this.props.onDownload}
          >
            Сохранить
          </button>
          <button className='file-menu-item' onClick={this.props.onAboutOpen}>
            О программе
          </button>
        </nav>
        {this.props.isAboutOpen && <Modal><About onClose={this.props.onAboutClose} /></Modal>}
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
  onDownload: PropTypes.func,
  onFileCreate: PropTypes.func.isRequired,
  onFileOpen: PropTypes.func.isRequired,
  isAboutOpen: PropTypes.bool,
  onAboutOpen: PropTypes.func,
  onAboutClose: PropTypes.func
}

export default FileMenuComponent
