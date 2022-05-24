import './Image.css'

import classNames from 'classnames'

import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Instrument } from '../../common/Instrument'
import { SelectionZoneType } from '../../common/SelectionZoneType'
import { addClickOutsideListener } from '../../common/helpers'

interface ImageProps {
  instrument: Instrument
  onInstrumentSelect: (instrument: Instrument) => void
  canModifySelection: boolean
  handleClipClick: () => void
  zoneType: SelectionZoneType
  selectZoneType: (type: SelectionZoneType) => void
  onSelectAll: () => void
  onDeleteSelected: () => void
  isSelectionTransparent: boolean
  setIsSelectionTransparent: (value: boolean) => void
  onInvertSelectedZone: () => void
  onRotateClockwise: () => void
  onRotateCounterClockwise: () => void
  onRotateUpsideDown: () => void
  onReflectHorizontally: () => void
  onReflectVertically: () => void
}

export const ImagePanel: FunctionComponent<ImageProps> = (props) => {
  const [isMenuShown, setIsMenuShown] = useState(false)
  const [isRotateMenuShown, setIsRotateMenuShown] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const rotateMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuRef.current) throw new Error('No menu in ref')
    return addClickOutsideListener(
      menuRef.current,
      () => setIsMenuShown(false)
    )
  })

  useEffect(() => {
    if (!rotateMenuRef.current) throw new Error('No menu in ref')
    return addClickOutsideListener(
      rotateMenuRef.current,
      () => setIsRotateMenuShown(false)
    )
  })

  return (
    <nav className="image">
      <section className="main-buttons" ref={menuRef}>
        <button
          className={classNames('select', {
            active: props.instrument === 'selection'
          })}
          onClick={() => props.onInstrumentSelect('selection')}>
          <svg viewBox="0 0 15 10">
            <rect
              width="15"
              height="10"
              style={{
                fill: 'transparent',
                strokeWidth: '1',
                strokeDasharray: '1',
                stroke: 'black'
              }}
            />
          </svg>
        </button>
        <button
          className={classNames({
            active: props.instrument === 'selection' || isMenuShown
          })}
          onClick={() => setIsMenuShown((value) => !value)}>Select<br/>▾</button>
        <nav
          className={classNames('select-options', { 'select-options_active': isMenuShown }) }
          onClick={() => setIsMenuShown(false)}>
            <span>Zone type</span>
            <button
              className={classNames({ active: props.zoneType === 'rectangle' && props.instrument === 'selection' })}
              onClick={() => props.selectZoneType('rectangle')}>Rectangular zone</button>
            <button
              className={classNames({ active: props.zoneType === 'freeform' && props.instrument === 'selection' })}
              onClick={() => props.selectZoneType('freeform')}>Free-form zone</button>
            <span>Options</span>
            <button onClick={props.onSelectAll}>Select all</button>
            <button onClick={props.onInvertSelectedZone} disabled={!props.canModifySelection}>Invert zone</button>
            <button onClick={props.onDeleteSelected} disabled={!props.canModifySelection}>Delete selected</button>
            <button
              className={classNames({ active: props.isSelectionTransparent })}
              onClick={() => props.setIsSelectionTransparent(!props.isSelectionTransparent)}>Transparency</button>
        </nav>
      </section>
      <section className="side-buttons" ref={rotateMenuRef}>
        <button
          onClick={props.handleClipClick}
          disabled={!props.canModifySelection}>
          Clip
        </button>
        <button>Change size</button>
        <button onClick={() => setIsRotateMenuShown((value) => !value)}>Rotate ▾</button>
        <nav
          className={classNames('select-options', { 'select-options_active': isRotateMenuShown }) }
          onClick={() => setIsRotateMenuShown(false)}>
            <button onClick={props.onRotateClockwise}>Rotate 90° right</button>
            <button onClick={props.onRotateCounterClockwise}>Rotate 90° left</button>
            <button onClick={props.onRotateUpsideDown}>Rotate 180°</button>
            <button onClick={props.onReflectHorizontally}>Reflect horizontally</button>
            <button onClick={props.onReflectVertically}>Reflect vertically</button>
        </nav>
      </section>
    </nav>
  )
}
