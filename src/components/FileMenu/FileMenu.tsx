import {
  MouseEventHandler, ChangeEventHandler, useState, useRef, useEffect, FunctionComponent
} from 'react'

import './FileMenu.css'

import classNames from 'classnames'

import {
  addClickOutsideListener
} from '../../common/helpers'

import { Modal } from '../Modal/Modal'
import { About } from '../About/About'

export interface FileMenuProps {
  onDownload: MouseEventHandler
  onFileCreate: MouseEventHandler
  onFileOpen: ChangeEventHandler<HTMLInputElement>
}

export const FileMenu: FunctionComponent<FileMenuProps> = (props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuRef.current) throw new Error('No menu in ref')
    return addClickOutsideListener(
      menuRef.current,
      () => setMenuOpen(false)
    )
  })

  return (
    <div
      className={classNames('file-menu', {
        'file-menu_open': menuOpen
      })}
      ref={menuRef}>
      <button className="file-menu-button" onClick={() => setMenuOpen((previous) => !previous)}>
          File
      </button>
      <nav className="file-menu-items" onClick={() => setMenuOpen(false)}>
        <button className="file-menu-item" onClick={props.onFileCreate}>
            Create
        </button>
        <label className="file-menu-item">
            Open
          <input
            type="file"
            className="file-menu-item"
            accept="image/*"
            onChange={props.onFileOpen}
          />
        </label>
        <button className="file-menu-item" onClick={props.onDownload}>
            Save
        </button>
        <button className="file-menu-item" onClick={() => setAboutOpen(true)}>
            About...
        </button>
      </nav>
      {aboutOpen && (
        <Modal onClose={() => setAboutOpen(false)}>
          <About />
        </Modal>
      )}
    </div>
  )
}
