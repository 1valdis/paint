import React, { Component } from 'react'
import './styles/Canvas.css'

import classNames from 'classnames'

import Resizer from './Resizer'

class Canvas extends Component {
  render () {
    return (
      <div className='canvas-wrapper'>
        <div
          className='canvas-wrapper-inner'
        >
          <canvas
            ref={this.props.onCanvasRef}
            className='canvas'
            width={this.props.width}
            height={this.props.height}
          />
          <Resizer onResizeStart={this.onResizeStart} onResizeEnd={this.onResizeEnd}
            outerStyle={{
              cursor: 'ew-resize',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            innerStyle={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <Resizer onResizeStart={this.onResizeStart} onResizeEnd={this.onResizeEnd}
            outerStyle={{
              cursor: 'ns-resize',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            innerStyle={{ left: '50%', transform: 'translateX(-50%)' }}
          />
          <Resizer onResizeStart={this.onResizeStart} onResizeEnd={this.onResizeEnd}
            outerStyle={{ cursor: 'nwse-resize', top: '100%', left: '100%' }}
          />
        </div>
      </div>
    )
  }
  onResizeStart = () => {
    this.setState({resizing: true})
  }
  onResizeEnd = () => {
    this.setState({resizing: false})
  }
}

export default Canvas
