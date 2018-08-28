import React, { PureComponent, createRef } from 'react'
import PropTypes from 'prop-types'

import './Resizer.css'

import classNames from 'classnames'

import ResizerPoint from '../ResizerPoint/ResizerPoint'

const directions = {
  canvas: ['e', 'se', 's'],
  selection: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
}

class Resizer extends PureComponent {
  constructor (...args) {
    super(...args)
    this.state = {
      resizing: false,
      resizeTop: this.props.top,
      resizeLeft: this.props.left,
      resizeWidth: this.props.width,
      resizeHeight: this.props.height
    }
    this.resizeRect = createRef()
  }
  render () {
    return (
      <div
        className={classNames('resizer', {
          resizer_resizing: this.state.resizing,
          'resizer_hide-border': this.props.hideBorderOnResizing
        })}
        ref={this.resizeRect}
        style={{
          width: `${this.state.resizing ? this.state.resizeWidth : this.props.width}px`,
          height: `${this.state.resizing ? this.state.resizeHeight : this.props.height}px`,
          top: `${this.state.resizing ? this.state.resizeTop : this.props.top}px`,
          left: `${this.state.resizing ? this.state.resizeLeft : this.props.left}px`
        }}
      >
        {directions[this.props.mode].map(d => (
          <ResizerPoint
            onResizeStart={this.onResizeStart.bind(this, d)}
            onResizeMove={this.onResizeMove.bind(this, d)}
            onResizeEnd={this.onResizeEnd.bind(this, d)}
            onResizeCancel={this.onResizeCancel.bind(this, d)}
            key={`${d}-resizer-point`}
            className={d}
          />
        ))}
      </div>
    )
  }
  onResizeStart (direction, e) {}
  onResizeMove (direction, e) {
    let {
      top,
      left,
      bottom,
      right
    } = this.resizeRect.current.getBoundingClientRect()
    const parentRect = this.resizeRect.current.parentNode.getBoundingClientRect()
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

    const state = {
      resizing: true,
      resizeTop: this.props.top,
      resizeLeft: this.props.left,
      resizeWidth: this.props.width,
      resizeHeight: this.props.height
    }

    switch (direction) {
      case 'n':
        state.resizeTop = mouseY - parentRect.top
        state.resizeHeight = this.props.height - state.resizeTop
        break
      case 'ne':
        state.resizeTop = mouseY - parentRect.top
        state.resizeHeight = this.props.height - state.resizeTop
        state.resizeWidth = mouseX - left
        break
      case 'e':
        state.resizeWidth = mouseX - left
        break
      case 'se':
        state.resizeHeight = mouseY - top
        state.resizeWidth = mouseX - left
        break
      case 's':
        state.resizeHeight = mouseY - top
        break
      case 'sw':
        state.resizeHeight = mouseY - top
        state.resizeLeft = mouseX - parentRect.left
        state.resizeWidth = this.props.width - state.resizeLeft
        break
      case 'w':
        state.resizeLeft = mouseX - parentRect.left
        state.resizeWidth = this.props.width - state.resizeLeft
        break
      case 'nw':
        state.resizeTop = mouseY - parentRect.top
        state.resizeHeight = this.props.height - state.resizeTop
        state.resizeLeft = mouseX - parentRect.left
        state.resizeWidth = this.props.width - state.resizeLeft
        break // no default
    }

    state.resizeTop = Math.round(
      state.resizeTop + window.pageYOffset >
        this.props.top + this.props.height - 1
        ? this.props.height + this.props.top - 1
        : state.resizeTop
    )
    state.resizeLeft = Math.round(
      state.resizeLeft + window.pageXOffset >
        this.props.left + this.props.width - 1
        ? this.props.width + this.props.left - 1
        : state.resizeLeft
    )
    state.resizeWidth = Math.round(
      state.resizeWidth > 0 ? state.resizeWidth : 1
    )
    state.resizeHeight = Math.round(
      state.resizeHeight > 0 ? state.resizeHeight : 1
    )
    if (this.props.onResizing) {
      this.props.onResizing(
        state.resizeTop,
        state.resizeLeft,
        state.resizeWidth,
        state.resizeHeight
      )
    }
    this.setState(state)
  }
  onResizeEnd (direction, e) {
    if (this.props.onResizeEnd) {
      this.props.onResizeEnd(
        this.state.resizeTop,
        this.state.resizeLeft,
        this.state.resizeWidth,
        this.state.resizeHeight
      )
    }
    this.setState({ resizing: false })
  }
  onResizeCancel (direction, e) {
    this.setState({
      resizing: false,
      resizeWidth: this.props.width,
      resizeHeight: this.props.height
    })
  }
  static getDerivedStateFromProps (nextProps, prevState = { resizing: false }) {
    return prevState.resizing
      ? null
      : {
        resizeTop: nextProps.top,
        resizeLeft: nextProps.left,
        resizeWidth: nextProps.width,
        resizeHeight: nextProps.height
      }
  }
}

Resizer.propTypes = {
  mode: PropTypes.oneOf(['canvas', 'selection']),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onResizeEnd: PropTypes.func,
  onResizing: PropTypes.func
}

export default Resizer
