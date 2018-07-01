import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import CanvasResizer from '../CanvasResizer/CanvasResizer'

import './Canvas.css'

class Canvas extends PureComponent {
  render () {
    return (
      <div className='canvas-wrapper'>
        <canvas
          ref='canvas'
          className='canvas'
          width={this.props.data ? this.props.data.width : 0}
          height={this.props.data ? this.props.data.height : 0}
        />
        <div
          className='canvas-upper-layer'
          style={{
            width: this.props.data ? this.props.data.width : 0,
            height: this.props.data ? this.props.data.height : 0
          }}
        >
          <CanvasResizer
            onResize={this.props.onResize}
            width={this.props.data ? this.props.data.width : 0}
            height={this.props.data ? this.props.data.height : 0}
          />
        </div>
      </div>
    )
  }
  updateCanvas = () => {
    const canvas = this.refs.canvas
    if (canvas != null && this.props.data != null) {
      ;[canvas.width, canvas.height] = [
        this.props.data.width, // zoom example: .../0.1,
        this.props.data.height // zoom example: .../0.1
      ]
      const ctx = canvas.getContext('2d')
      ctx.putImageData(this.props.data, 0, 0)
      // zoom example:
      // ctx.imageSmoothingEnabled = false
      // ctx.webkitImageSmoothingEnabled = false
      // ctx.mozImageSmoothingEnabled = false
      // ctx.msImageSmoothingEnabled = false
      // ctx.oImageSmoothingEnabled = false
      // ctx.drawImage(canvas, 0, 0, 0.1*canvas.width, 0.1*canvas.height, 0, 0, canvas.width, canvas.height)
    }
  }
  componentDidMount () {
    this.updateCanvas()
  }
  componentDidUpdate () {
    this.updateCanvas()
  }
}

Canvas.propTypes = {
  data: PropTypes.object
}

const mapStateToProps = state => ({
  data: state.image.data
})

export default connect(mapStateToProps)(Canvas)
