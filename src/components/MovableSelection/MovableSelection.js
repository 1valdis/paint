import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './MovableSelection.css'

import Resizer from '../Resizer/Resizer'

class MovableSelection extends PureComponent {
  constructor (...args) {
    super(...args)
    this.state = {
      moving: false,
      startX: null,
      startY: null,
      top: this.props.top,
      left: this.props.left
    }
  }
  render () {
    const {
      onResizeEnd,
      onResizing,
      onMoveEnd,
      onMoving,
      ...withoutOnChange
    } = this.props
    if (this.props.onResizing) {
      withoutOnChange.onResizing = this.onResizing
    }
    if (this.props.onResizeEnd) {
      withoutOnChange.onResizeEnd = this.onResizeEnd
    }
    return (
      <div
        style={this.props}
        onPointerDown={this.handlePointerDown}
        className='movable-selection'
      >
        <Resizer mode='selection' {...withoutOnChange} top={0} left={0} />
      </div>
    )
  }
  onResizeEnd = (top, left, width, height) => {
    this.props.onResizeEnd({
      top: this.props.top + top,
      left: this.props.left + left,
      width,
      height
    })
  }
  onResizing = (top, left, width, height) => {
    this.props.onResizing({
      top: this.props.top + top,
      left: this.props.left + left,
      width,
      height
    })
  }
  handlePointerDown = e => {
    if (e.target === e.currentTarget) {
      this.setState({
        moving: true,
        startX: e.clientX + window.pageXOffset,
        startY: e.clientY + window.pageYOffset
      })
    }
  }
  handleDocumentPointerMove = e => {
    if (
      this.state.moving &&
      this.state.startX !== null &&
      this.props.onMoving
    ) {
      switch (e.buttons) {
        case 1:
          const {
            onResizeEnd,
            onResizing,
            onMoveEnd,
            onMoving,
            ...coords
          } = this.props
          coords.top =
            this.state.top +
            (e.clientY + window.pageYOffset - this.state.startY)
          coords.left =
            this.state.left +
            (e.clientX + window.pageXOffset - this.state.startX)
          this.props.onMoving(coords)
          break
        case 2:
        case 3:
          this.props.onMoving({
            top: this.state.top,
            left: this.state.left,
            width: this.props.width,
            height: this.props.height,
          })
          this.setState({
            moving: false
          })
          this.preventContextMenu = true
          break // no default
      }
    }
  }
  handleDocumentPointerUp = e => {
    if (
      this.state.moving &&
      this.state.startX !== null &&
      this.props.onMoving
    ) {
      const {
        onResizeEnd,
        onResizing,
        onMoveEnd,
        onMoving,
        ...coords
      } = this.props
      coords.top =
        this.state.top + (e.clientY + window.pageYOffset - this.state.startY)
      coords.left =
        this.state.left + (e.clientX + window.pageXOffset - this.state.startX)
      this.props.onMoveEnd(coords)
    }
    this.setState({
      moving: false,
      startX: null,
      startY: null
    })
  }
  static getDerivedStateFromProps = (props, state) => {
    if (!state.moving) {
      return {
        top: props.top,
        left: props.left
      }
    }
    return null
  }
  componentDidMount () {
    document.addEventListener('pointermove', this.handleDocumentPointerMove, {passive: true})
    document.addEventListener('pointerup', this.handleDocumentPointerUp, {passive: true})
    document.addEventListener('contextmenu', this.handleContextMenu)
  }
  componentWillUnmount () {
    document.removeEventListener('pointermove', this.handleDocumentPointerUp, {passive: true})
    document.removeEventListener('pointerup', this.handleDocumentPointerUp, {passive: true})
    document.removeEventListener('contextmenu', this.handleContextMenu)
  }
  
  handleContextMenu = e => {
    if (this.preventContextMenu) {
      e.preventDefault()
      this.preventContextMenu = false
    }
  }
}

MovableSelection.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  hideBorderOnResizing: PropTypes.bool,
  onResizeEnd: PropTypes.func,
  onResizing: PropTypes.func,
  onMoveEnd: PropTypes.func,
  onMoving: PropTypes.func
}

export default MovableSelection
