import React, { PureComponent, createRef, RefObject } from 'react'

import { connect } from 'react-redux'

import { StoreState } from '../../reducers'
import { CanvasResizer } from '../CanvasResizer/CanvasResizer'
import { CanvasEditor } from '../CanvasEditor/CanvasEditor'

import './Canvas.css'

export interface CanvasProps {
  imageData: ImageData
}

class _Canvas extends PureComponent<CanvasProps> {
  canvas: RefObject<HTMLCanvasElement> = createRef()

  render() {
    return (
      <div className="canvas-wrapper">
        <canvas
          ref={this.canvas}
          className="canvas"
          width={this.props.imageData.width}
          height={this.props.imageData.height}
        />
        <div
          className="canvas-upper-layer"
          style={{
            width: this.props.imageData.width,
            height: this.props.imageData.height
          }}>
          <CanvasResizer />
          <CanvasEditor />
        </div>
      </div>
    )
  }

  updateCanvas = () => {
    const canvas = this.canvas.current
    if (canvas != null) {
      ;[canvas.width, canvas.height] = [
        this.props.imageData.width,
        this.props.imageData.height
      ]
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error("Couldn't acquire context")
      ctx.putImageData(this.props.imageData, 0, 0)
    }
  }

  componentDidMount() {
    this.updateCanvas()
  }

  componentDidUpdate() {
    this.updateCanvas()
  }
}

const mapStateToProps = (state: StoreState) => ({
  imageData: state.image.imageData
})

export const Canvas = connect(mapStateToProps)(_Canvas)
