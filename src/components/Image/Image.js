import React, { Component } from 'react'
import './Image.css'

import {connect} from 'react-redux'

import classNames from 'classnames'

import {selectInstrument} from '../instruments/actions'

class Image extends Component {
  render () {
    return (
      <nav className='image'>
        <button className={classNames('select', {select_active: this.props.instrument === 'selection'})} onClick={this.handleClick}>
          <svg viewBox='0 0 15 10'>
            <rect
              width='15'
              height='10'
              style={{
                fill: 'transparent',
                strokeWidth: '1',
                strokeDasharray: '1',
                stroke: 'black'
              }}
            />
          </svg>
          <footer>Выделить</footer>
        </button>
      </nav>
    )
  }
  handleClick = () => {
    this.props.selectInstrument('selection')
  }
}

const mapStateToProps = state => ({
  instrument: state.instruments.instrument
})
const mapDispatchToProps = dispatch => ({
  selectInstrument: instrument => dispatch(selectInstrument(instrument))
})

export default connect(mapStateToProps, mapDispatchToProps)(Image)
