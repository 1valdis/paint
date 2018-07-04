import React, { PureComponent } from 'react'

import { connect } from 'react-redux'

import { selectInstrument } from './actions'

import classNames from 'classnames'
import './Instruments.css'

const instruments = ['pen', 'bucket', 'text', 'eraser', 'dropper', 'zoom']

class Instruments extends PureComponent {
  render () {
    return (
      <div className='instruments'>
        {instruments.map(i => (
          <button
            className={classNames(`instrument_${i}`, {
              instrument_active: i === this.props.instrument
            })}
            key={`instrument_${i}`}
            onClick={this.props.selectInstrument.bind(undefined, i)}
          />
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  instrument: state.instruments.instrument
})
const mapDispatchToProps = dispatch => ({
  selectInstrument: instrument => dispatch(selectInstrument(instrument))
})

export default connect(mapStateToProps, mapDispatchToProps)(Instruments)
