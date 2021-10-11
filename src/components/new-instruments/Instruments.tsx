import { FunctionComponent } from 'react'

import classNames from 'classnames'
import { Instrument } from '../NewImage/Image'

import './Instruments.css'

export interface InstrumentsProps {
  instrument: Instrument
  selectInstrument: (instrument: Instrument) => void
}

const instrumentsList: Instrument[] = [
  'pen',
  'fill',
  'text',
  'eraser',
  'dropper',
  'zoom'
]

export const Instruments: FunctionComponent<InstrumentsProps> = props => (
  <div className="instruments">
    {instrumentsList.map((i) => (
      <button
        className={classNames(`instrument_${i}`, {
          instrument_active: i === props.instrument
        })}
        key={`instrument_${i}`}
        onClick={() => props.selectInstrument(i)}
      />
    ))}
  </div>
)
