import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Pen from '../instruments/Pen/Pen'

const instruments = {
  pen: Pen
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
