import React, { Component } from 'react'
import './styles/Canvas.css'

import classNames from 'classnames'

import Resizer from './Resizer'

class CanvasResizer extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      resizing: false,
      resizeWidth: this.props.width,
      resizeHeight: this.props.height
    }
  }
  render () {
    return (
      <React.Fragment>
        <div
          className={classNames('canvas-wrapper-inner', {
            'canvas-wrapper-inner_resizing': this.state.resizing
          })}
          ref='resizeRect'
          style={{
            width: `${this.state.resizeWidth}px`,
            height: `${this.state.resizeHeight}px`
          }}
        >
          <Resizer
            onResizeStart={e => this.onResizeStart(e, 'ew')}
            onResizeMove={this.onResizeMove}
            onResizeEnd={this.onResizeEnd}
            outerStyle={{
              cursor: 'ew-resize',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            innerStyle={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <Resizer
            onResizeStart={e => this.onResizeStart(e, 'ns')}
            onResizeMove={e => this.onResizeMove(e, 'ns')}
            onResizeEnd={e => this.onResizeEnd(e, 'ns')}
            outerStyle={{
              cursor: 'ns-resize',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            innerStyle={{ left: '50%', transform: 'translateX(-50%)' }}
          />
          <Resizer
            onResizeStart={e => this.onResizeStart(e, 'nwse')}
            onResizeMove={this.onResizeMove}
            onResizeEnd={this.onResizeEnd}
            outerStyle={{ cursor: 'nwse-resize', top: '100%', left: '100%' }}
          />
        </div>
        {...this.props.children}
      </React.Fragment>
    )
  }
  onResizeStart = (e, direction) => {
    console.log('resizeStart')
  }
  onResizeMove = (e, direction) => {
    let {
      top,
      left,
      bottom,
      right
    } = this.refs.resizeRect.getBoundingClientRect()
    ;[top, left, bottom, right] = [
      top + window.pageYOffset,
      left + window.pageXOffset,
      bottom + window.pageYOffset,
      right + window.pageXOffset
    ]
    const [mouseX, mouseY] = [
      e.clientX + window.pageXOffset,
      e.clientY + window.pageYOffset
    ]
    const [newWidth, newHeight] = [
      Math.round(mouseX - left),
      Math.round(mouseY - top)
    ]
    console.log(newWidth, newHeight)

    const state = {
      resizing: true
    }

    if (direction === 'ns') {
      state.resizeHeight = newHeight
      console.log(bottom - top)
    } else if (direction === 'ew') {
      state.resizeWidth = newWidth
    } else {
      state.resizeHeight = newHeight
      state.resizeWidth = newWidth
    }
    this.setState(state)
    console.log('resizeMove')
  }
  onResizeEnd = (e, direction) => {
    this.setState({ resizing: false })
    console.log('resizeEnd')
  }
}

export default CanvasResizer
