import React, { Component } from 'react'

import './styles/Canvas.css'

class Canvas extends Component {
  render () {
    return (
      <div className='canvas-wrapper'>
        <canvas ref='canvas' className='canvas' />
      </div>
    )
  }
  componentDidMount () {
    this.ctx = this.refs.canvas.getContext('2d', {alpha: false})
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }
  shouldComponentUpdate () {
    return false
  }
}

export default Canvas
