import React, { Component } from 'react'
import './Canvas.css'

import classNames from 'classnames'

import Resizer from './Resizer'

class Canvas extends Component {
  render () {
    return (
      <div className='canvas-wrapper'>
        <canvas
          ref={this.props.onCanvasRef}
          className='canvas'
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    )
  }
}

export default Canvas
