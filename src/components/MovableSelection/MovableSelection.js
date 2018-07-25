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
    const { onChange, ...withoutOnChange } = this.props
    return (
      <div
        className='movable-selection'
        style={this.props}
        onPointerDown={this.handlePointerDown}
      >
        <Resizer
          mode='selection'
          onResize={this.onResize}
          {...withoutOnChange}
          top={0}
          left={0}
        />
      </div>
    )
  }
  onResize = (top, left, width, height) => {
    this.props.onChange({
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
    if (this.state.moving && this.state.startX !== null) {
      const { onChange, ...coords } = this.props
      coords.top =
        this.state.top + (e.clientY + window.pageYOffset - this.state.startY)
      coords.left =
        this.state.left + (e.clientX + window.pageXOffset - this.state.startX)
      this.props.onChange(coords)
    }
  }
  handleDocumentPointerUp = e => {
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
    document.addEventListener('pointermove', this.handleDocumentPointerMove)
    document.addEventListener('pointerup', this.handleDocumentPointerUp)
  }
  componentWillUnmount () {
    document.removeEventListener('pointermove', this.handleDocumentPointerUp)
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
  }
}

// const mapStateToProps = state => ({
//   instrument: state.instruments.instrument,
//   imageData: state.instruments.imageData
// })

// const mapDispatchToProps = dispatch => ({})

// export default connect(mapStateToProps, mapDispatchToProps)(MovableSelection)

MovableSelection.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default MovableSelection
