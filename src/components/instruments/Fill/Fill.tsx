import React, { PureComponent, createRef, RefObject, MouseEvent } from 'react'

import { connect } from 'react-redux'

import './Fill.css'
import { getCanvasCoordsFromEvent } from '../../helpers'
import { Color, Action, changeImage } from '../../../actions'
import { ThunkDispatch } from 'redux-thunk'
import { StoreState } from '../../../reducers'

export interface FillProps {
  color: Color
  imageData: ImageData
  changeImage: (imageData: ImageData) => void
}

type Point = [number, number]

class _Fill extends PureComponent<FillProps> {
  canvasRef: RefObject<HTMLCanvasElement>

  ctx?: CanvasRenderingContext2D

  constructor(props: FillProps) {
    super(props)
    this.canvasRef = createRef<HTMLCanvasElement>()
  }

  render() {
    return (
      <canvas
        className="fill-canvas"
        ref={this.canvasRef}
        width={this.props.imageData ? this.props.imageData.width : 0}
        height={this.props.imageData ? this.props.imageData.height : 0}
        onMouseDown={this.handleMouseDown}
      />
    )
  }

  handleMouseDown = (e: MouseEvent) => {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
    if (!this.ctx) throw new Error("Coudn't acquire context")
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
    this.props.changeImage(data)
  }

  // optimized the shit out of it (as I can judge)
  floodFill = (
    data: ImageData,
    x: number,
    y: number,
    colorToReplace: Color,
    colorToFillWith: Color
  ) => {
    const replaceR = colorToReplace.r
    const replaceG = colorToReplace.g
    const replaceB = colorToReplace.b
    const fillR = colorToFillWith.r
    const fillG = colorToFillWith.g
    const fillB = colorToFillWith.b

    const i = (y * data.width + x) * 4

    if (
      !(
        replaceR === data.data[i] &&
        replaceG === data.data[i + 1] &&
        replaceB === data.data[i + 2]
      ) ||
      (replaceR === fillR && replaceG === fillG && replaceB === fillB)
    ) {
      return
    }

    const q: Point[] = []

    data.data[i] = fillR
    data.data[i + 1] = fillG
    data.data[i + 2] = fillB

    q.push([x, y])

    while (q.length !== 0) {
      const n = q.shift()!
      const i = (n[1] * data.width + n[0]) * 4
      if (
        n[0] > 0 &&
        replaceR === data.data[i - 4] &&
        replaceG === data.data[i - 3] &&
        replaceB === data.data[i - 2]
      ) {
        data.data[i - 4] = fillR
        data.data[i - 3] = fillG
        data.data[i - 2] = fillB
        q.push([n[0] - 1, n[1]])
      }
      if (
        n[0] < data.width - 1 &&
        replaceR === data.data[i + 4] &&
        replaceG === data.data[i + 5] &&
        replaceB === data.data[i + 6]
      ) {
        data.data[i + 4] = fillR
        data.data[i + 5] = fillG
        data.data[i + 6] = fillB
        q.push([n[0] + 1, n[1]])
      }
      if (
        n[1] > 0 &&
        replaceR === data.data[i - data.width * 4] &&
        replaceG === data.data[i - data.width * 4 + 1] &&
        replaceB === data.data[i - data.width * 4 + 2]
      ) {
        data.data[i - data.width * 4] = fillR
        data.data[i - data.width * 4 + 1] = fillG
        data.data[i - data.width * 4 + 2] = fillB
        q.push([n[0], n[1] - 1])
      }
      if (
        n[1] < data.height - 1 &&
        replaceR === data.data[i + data.width * 4] &&
        replaceG === data.data[i + data.width * 4 + 1] &&
        replaceB === data.data[i + data.width * 4 + 2]
      ) {
        data.data[i + data.width * 4] = fillR
        data.data[i + data.width * 4 + 1] = fillG
        data.data[i + data.width * 4 + 2] = fillB
        q.push([n[0], n[1] + 1])
      }
    }
  }

  componentDidMount() {
    if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
    this.ctx = this.canvasRef.current.getContext('2d') || undefined
    if (!this.ctx) throw new Error("Coudn't acquire context")
    if (this.props.imageData != null) {
      this.ctx.putImageData(this.props.imageData, 0, 0)
    }
  }

  componentDidUpdate() {
    if (!this.ctx) throw new Error("Coudn't acquire context")
    this.ctx.putImageData(this.props.imageData, 0, 0)
  }
}

const mapStateToProps = (state: StoreState) => ({
  color: state.colors.list[state.colors.primary],
  imageData: state.image.data
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const Fill = connect(mapStateToProps, mapDispatchToProps)(_Fill)
