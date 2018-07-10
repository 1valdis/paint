import React, { PureComponent, createRef } from 'react'

import { connect } from 'react-redux'

import './Fill.css'
import { getCanvasCoordsFromEvent } from '../../helpers'
import { changeImage } from '../../App/actions'

class Fill extends PureComponent {
  constructor (...args) {
    super(...args)
    this.canvasRef = createRef()
  }
  render () {
    return (
      <canvas
        className='fill-canvas'
        ref={this.canvasRef}
        width={this.props.imageData ? this.props.imageData.width : 0}
        height={this.props.imageData ? this.props.imageData.height : 0}
        onMouseDown={this.handleMouseDown}
      />
    )
  }
  handleMouseDown = e => {
    const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
    const data = this.ctx.getImageData(
      0,
      0,
      this.canvasRef.current.width,
      this.canvasRef.current.height
    )
    this.floodFill(
      data,
      x,
      y,
      {
        r: data.data[(y * data.width + x) * 4],
        g: data.data[(y * data.width + x) * 4 + 1],
        b: data.data[(y * data.width + x) * 4 + 2]
      },
      this.props.color
    )
    this.props.dispatch(changeImage(data))
  }
  // optimized the shit out of it (as I can judge) 
  floodFill = (data, x, y, colorToReplace, colorToFillWith) => {
    const replaceR = colorToReplace.r,
      replaceG = colorToReplace.g,
      replaceB = colorToReplace.b
    const fillR = colorToFillWith.r,
      fillG = colorToFillWith.g,
      fillB = colorToFillWith.b

    const i = (y * data.width + x) * 4

    if (
      !(replaceR === data.data[i] &&
        replaceG === data.data[i + 1] &&
        replaceB === data.data[i + 2]) ||
      (replaceR === fillR && replaceG === fillG && replaceB === fillB)
    ) {
      return
    }

    const q = []

    data.data[i] = fillR
    data.data[i + 1] = fillG
    data.data[i + 2] = fillB

    q.push([x, y])

    while (q.length !== 0) {
      const n = q.shift()
      const i = (n[1] * data.width + n[0]) * 4
      if (
        n[0] > 0 &&
        (replaceR === data.data[i - 4] &&
          replaceG === data.data[i - 3] &&
          replaceB === data.data[i - 2])
      ) {
        data.data[i - 4] = fillR
        data.data[i - 3] = fillG
        data.data[i - 2] = fillB
        q.push([n[0] - 1, n[1]])
      }
      if (
        n[0] < data.width - 1 &&
        (replaceR === data.data[i + 4] &&
          replaceG === data.data[i + 5] &&
          replaceB === data.data[i + 6])
      ) {
        data.data[i + 4] = fillR
        data.data[i + 5] = fillG
        data.data[i + 6] = fillB
        q.push([n[0] + 1, n[1]])
      }
      if (
        n[1] > 0 &&
        (replaceR === data.data[i - data.width * 4] &&
          replaceG === data.data[i - data.width * 4 + 1] &&
          replaceB === data.data[i - data.width * 4 + 2])
      ) {
        data.data[i - data.width * 4] = fillR
        data.data[i - data.width * 4 + 1] = fillG
        data.data[i - data.width * 4 + 2] = fillB
        q.push([n[0], n[1] - 1])
      }
      if (
        n[1] < data.height - 1 &&
        (replaceR === data.data[i + data.width * 4] &&
          replaceG === data.data[i + data.width * 4 + 1] &&
          replaceB === data.data[i + data.width * 4 + 2])
      ) {
        data.data[i + data.width * 4] = fillR
        data.data[i + data.width * 4 + 1] = fillG
        data.data[i + data.width * 4 + 2] = fillB
        q.push([n[0], n[1] + 1])
      }
    }
  }
  componentDidMount () {
    this.ctx = this.canvasRef.current.getContext('2d')
    if (this.props.imageData != null) {
      this.ctx.putImageData(this.props.imageData, 0, 0)
    }
  }
  componentDidUpdate () {
    this.ctx.putImageData(this.props.imageData, 0, 0)
  }
}

const mapStateToProps = state => ({
  color: state.colors.list[state.colors[state.colors.activeColor]],
  imageData: state.image.data
})

export default connect(mapStateToProps)(Fill)
