import './Image.css'

import classNames from 'classnames'

import { FunctionComponent, useState } from 'react'
import { Instrument } from '../../common/Instrument'
import { SelectionZoneType } from '../../common/SelectionZoneType'
import { Modal } from '../Modal/Modal'
import { ResizeSkew, ResizeSkewResult } from './ResizeSkew'
import { Dropdown } from '../Dropdown/Dropdown'

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
  selectionOrImageWidth: number
  selectionOrImageHeight: number
  handleResizeSkew: (settings: ResizeSkewResult) => void
}

export const ImagePanel: FunctionComponent<ImageProps> = (props) => {
  const [isModalShown, setIsModalShown] = useState(false)

  return (
    <>
    <nav className="image">
      <section className="main-buttons">
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
        <Dropdown buttonContent={<>Select<br/>▾</>}>
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
        </Dropdown>
      </section>
      <section className="side-buttons">
        <button
          onClick={props.handleClipClick}
          disabled={!props.canModifySelection}>
          Clip
        </button>
        <button onClick={() => setIsModalShown(true)}>Change size</button>
        <Dropdown buttonContent="Rotate ▾">
          <button onClick={props.onRotateClockwise}>Rotate 90° right</button>
          <button onClick={props.onRotateCounterClockwise}>Rotate 90° left</button>
          <button onClick={props.onRotateUpsideDown}>Rotate 180°</button>
          <button onClick={props.onReflectHorizontally}>Reflect horizontally</button>
          <button onClick={props.onReflectVertically}>Reflect vertically</button>
        </Dropdown>
      </section>
    </nav>
    {isModalShown
      ? <Modal title="Change size and skew" onClose={() => setIsModalShown(false)}>
          <ResizeSkew
            startingWidth={props.selectionOrImageWidth}
            startingHeight={props.selectionOrImageHeight}
            handleResizeSkew={(options) => { props.handleResizeSkew(options); setIsModalShown(false) }}
            handleCancel={() => setIsModalShown(false)}
          />
        </Modal>
      : null}
    </>
  )
}
