import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './MovableSelection.css'

import Resizer from '../Resizer/Resizer'

class MovableSelection extends PureComponent {
  constructor (...args) {
    super(...args)
    this.state = {
      moving: false
    }
  }
  render () {
    const { onChange, ...withoutOnChange } = this.props
    return (
      <div className='movable-selection' style={this.props} onPointerDown={this.handlePointerDown}>
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
    this.props.onChange(
      this.props.top + top,
      this.props.left + left,
      width,
      height
    )
  }
  handlePointerDown = e => {
    
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
