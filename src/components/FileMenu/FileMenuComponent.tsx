import React, {
  PureComponent,
  createRef,
  MouseEventHandler,
  RefObject,
  ChangeEventHandler
} from 'react'

import './FileMenu.css'

import classNames from 'classnames'

import { addClickOutsideListener, removeClickOutsideListener } from '../helpers'

import { Modal } from '../Modal/Modal'
import { About } from './about/About'

export interface FileMenuComponentProps {
  isOpen: boolean
  isAboutOpen: boolean
  onClick: MouseEventHandler
  onClickInside: MouseEventHandler
  onClickOutside: MouseEventHandler
  onDownload: MouseEventHandler
  onFileCreate: MouseEventHandler
  onFileOpen: ChangeEventHandler
  onAboutOpen: MouseEventHandler
  onAboutClose: MouseEventHandler
}

export class FileMenuComponent extends PureComponent<FileMenuComponentProps> {
  menu: RefObject<HTMLDivElement>

  clickOutsideListener?: Function

  constructor(props: FileMenuComponentProps) {
    super(props)
    this.menu = createRef()
  }

  render() {
    return (
      <div
        ref={this.menu}
        className={classNames('file-menu', {
          'file-menu_open': this.props.isOpen
        })}>
        <button className="file-menu-button" onClick={this.props.onClick}>
          Файл
        </button>
        <nav className="file-menu-items" onClick={this.props.onClickInside}>
          <button className="file-menu-item" onClick={this.props.onFileCreate}>
            Создать
          </button>
          <label className="file-menu-item">
            Открыть
            <input
              type="file"
              className="file-menu-item"
              accept="image/*"
              onChange={this.props.onFileOpen}
            />
          </label>
          <button className="file-menu-item" onClick={this.props.onDownload}>
            Сохранить
          </button>
          <button className="file-menu-item" onClick={this.props.onAboutOpen}>
            О программе
          </button>
        </nav>
        {this.props.isAboutOpen && (
          <Modal>
            <About onClose={this.props.onAboutClose} />
          </Modal>
        )}
      </div>
    )
  }

  componentDidMount() {
    this.clickOutsideListener = addClickOutsideListener(
      this.menu.current,
      this.props.onClickOutside
    )
  }

  componentWillUnmount() {
    removeClickOutsideListener(this.clickOutsideListener)
  }
}
