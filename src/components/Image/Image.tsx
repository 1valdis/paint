import './Image.css'

import classNames from 'classnames'

import { FunctionComponent } from 'react'
import { Instrument } from '../../common/Instrument'

interface ImageProps {
  instrument: Instrument
  onInstrumentSelect: (instrument: Instrument) => void
  canClip: boolean
  handleClipClick: () => void
}

export const ImagePanel: FunctionComponent<ImageProps> = (props) => {
  return (
    <nav className="image">
      <button
        className={classNames('select', {
          select_active: props.instrument === 'selection'
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
        <footer>Select</footer>
      </button>
      <div className="side-buttons">
        <button
          onClick={props.handleClipClick}
          disabled={!props.canClip}>
          Clip
        </button>
        <button>Change size</button>
        <button>Rotate</button>
      </div>
    </nav>
  )
}
