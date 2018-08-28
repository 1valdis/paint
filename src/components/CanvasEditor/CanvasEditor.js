import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import SelectionInstrument from '../instruments/SelectionInstrument/SelectionInstrument'
import Pen from '../instruments/Pen/Pen'
import Fill from '../instruments/Fill/Fill'
import Dropper from '../instruments/Dropper/Dropper'
import Eraser from '../instruments/Eraser/Eraser'

const instruments = {
  pen: Pen,
  fill: Fill,
  selection: SelectionInstrument,
  dropper: Dropper,
  eraser: Eraser
}

class CanvasEditor extends PureComponent {
  render () {
    const Element = instruments[this.props.instrument]
    return Element != null ? <Element /> : null
  }
}

CanvasEditor.propTypes = {
  instrument: PropTypes.string
}

const mapStateToProps = state => ({
  instrument: state.instruments.instrument
})

export default connect(mapStateToProps)(CanvasEditor)
