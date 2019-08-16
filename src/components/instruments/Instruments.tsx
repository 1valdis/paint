import React, { FunctionComponent } from 'react'

import { connect } from 'react-redux'

import {
  selectInstrument,
  Instruments as InstrumentsList,
  Action
} from '../../actions'

import classNames from 'classnames'
import './Instruments.css'
import { StoreState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'

export interface InstrumentsProps {
  instrument: InstrumentsList
  selectInstrument: (instrument: InstrumentsList) => void
}

const _Instruments: FunctionComponent<InstrumentsProps> = props => (
  <div className="instruments">
    {Object.values(InstrumentsList)
      .filter(
        (instrument: InstrumentsList) =>
          instrument !== InstrumentsList.selection
      )
      .map((i: InstrumentsList) => (
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

const mapStateToProps = (state: StoreState) => ({
  instrument: state.instruments.instrument
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  selectInstrument: (instrument: InstrumentsList) =>
    dispatch(selectInstrument(instrument))
})

export const Instruments = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Instruments)
