import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Canvas.css'

import classNames from 'classnames'

import Resizer from '../CanvasResizer/Resizer'

class Canvas extends Component {
  render () {
    return (
      <div className='canvas-wrapper'>
        <canvas
          ref='canvas'
          className='canvas'
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    )
  }
  updateCanvas = () => {
    const canvas = this.refs.canvas
    if (canvas != null && this.props.data != null) {
      ;[canvas.width, canvas.height] = [this.props.data.width, this.props.data.height]
      const ctx = canvas.getContext('2d')
      ctx.putImageData(this.props.data, 0, 0)
    }
  }
  componentDidMount(){
    this.updateCanvas()
  }
  componentDidUpdate(){
    this.updateCanvas()
  }
}

const mapStateToProps = state => ({
  data: state.image.data
})

export default connect(mapStateToProps)(Canvas)
