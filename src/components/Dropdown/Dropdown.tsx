import { FC, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { addClickOutsideListener } from '../../common/helpers'
import './Dropdown.css'

export interface DropdownProps {
  buttonContent: ReactNode
  isDisabled: boolean
}

export const Dropdown: FC<PropsWithChildren<DropdownProps>> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuRef.current) throw new Error('No menu in ref')
    return addClickOutsideListener(
      menuRef.current,
      () => setIsOpen(false)
    )
  })

  return (
    <div
      className={classNames('dropdown-menu', {
        'dropdown-menu_open': isOpen
      })}
      ref={menuRef}>
      <button className="dropdown-button" onClick={() => setIsOpen((previous) => !previous)}>
          {props.buttonContent}
      </button>
      <nav className="dropdown-menu-items" onClick={() => setIsOpen(false)}>
        {props.children}
      </nav>
    </div>
  )
}
