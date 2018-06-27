import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './CanvasResizer.css'

import classNames from 'classnames'

import Resizer from './Resizer'

class CanvasResizer extends PureComponent {
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
      <div
        className={classNames('canvas-resizer', {
          'canvas-resizer_resizing': this.state.resizing
        })}
        ref='resizeRect'
        style={{
          width: `${this.state.resizing ? this.state.resizeWidth : this.props.width}px`,
          height: `${this.state.resizing ? this.state.resizeHeight : this.props.height}px`
        }}
      >
        <Resizer
          onResizeStart={e => this.onResizeStart(e, 'ew')}
          onResizeMove={e => this.onResizeMove(e, 'ew')}
          onResizeEnd={e => this.onResizeEnd(e, 'ew')}
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
          onResizeMove={e => this.onResizeMove(e, 'nwse')}
          onResizeEnd={e => this.onResizeEnd(e, 'nwse')}
          outerStyle={{ cursor: 'nwse-resize', top: '100%', left: '100%' }}
        />
      </div>
    )
  }
  onResizeStart = (e, direction) => {}
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
    
    const state = {
      resizeWidth: this.props.width,
      resizeHeight: this.props.height,
      resizing: true
    }
    
    if (direction === 'ns') {
      state.resizeHeight = newHeight
    } else if (direction === 'ew') {
      state.resizeWidth = newWidth
    } else {
      state.resizeHeight = newHeight
      state.resizeWidth = newWidth
    }
    
    state.resizeWidth = state.resizeWidth > 0 ? state.resizeWidth : 1
    state.resizeHeight = state.resizeHeight > 0 ? state.resizeHeight : 1
    
    this.setState(state)
  }
  onResizeEnd = (e, direction) => {
    this.props.onResize(this.state.resizeWidth, this.state.resizeHeight)
    this.setState({ resizing: false })
  }
}

CanvasResizer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default CanvasResizer
