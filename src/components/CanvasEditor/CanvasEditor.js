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
    return <Element {...this.props.instrumentData} />
  }
}

export default CanvasEditor
