import React, {
  PureComponent,
  createRef,
  MouseEventHandler,
  RefObject,
  ChangeEventHandler
} from 'react'

import './FileMenu.css'

import classNames from 'classnames'

import {
  addClickOutsideListener,
  removeClickOutsideListener,
  ClickOutsideListener
} from '../helpers'

import { Modal } from '../Modal/Modal'
import { About } from './about/About'

export interface FileMenuProps {
  onDownload: MouseEventHandler
  onFileCreate: MouseEventHandler
  onFileOpen: ChangeEventHandler
}

interface FileMenuState {
  menuOpen: boolean
  aboutOpen: boolean
}

export class FileMenu extends PureComponent<FileMenuProps, FileMenuState> {
  menu: RefObject<HTMLDivElement>

  clickOutsideListener?: ClickOutsideListener

  constructor(props: FileMenuProps) {
    super(props)
    this.menu = createRef()
    this.state = { menuOpen: false, aboutOpen: false }
  }

  render() {
    return (
      <div
        ref={this.menu}
        className={classNames('file-menu', {
          'file-menu_open': this.state.menuOpen
        })}>
        <button className="file-menu-button" onClick={this.toggleMenu}>
          File
        </button>
        <nav className="file-menu-items" onClick={this.closeMenu}>
          <button className="file-menu-item" onClick={this.props.onFileCreate}>
            Create
          </button>
          <label className="file-menu-item">
            Open
            <input
              type="file"
              className="file-menu-item"
              accept="image/*"
              onChange={this.props.onFileOpen}
            />
          </label>
          <button className="file-menu-item" onClick={this.props.onDownload}>
            Save
          </button>
          <button className="file-menu-item" onClick={this.openAbout}>
            About...
          </button>
        </nav>
        {this.state.aboutOpen && (
          <Modal>
            <About onClose={this.closeAbout} />
          </Modal>
        )}
      </div>
    )
  }

  componentDidMount() {
    if (this.menu.current)
      this.clickOutsideListener = addClickOutsideListener(
        this.menu.current,
        this.closeMenu
      )
  }

  componentWillUnmount() {
    if (this.clickOutsideListener)
      removeClickOutsideListener(this.clickOutsideListener)
  }

  toggleMenu = () => this.setState(state => ({ menuOpen: !state.menuOpen }))

  closeMenu = () => this.setState({ menuOpen: false })

  openAbout = () => this.setState({ aboutOpen: true })

  closeAbout = () => this.setState({ aboutOpen: false })
}
