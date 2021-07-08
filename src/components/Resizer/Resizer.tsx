import React, { PureComponent, createRef, RefObject } from 'react'

import './Resizer.css'

import classNames from 'classnames'

import { ResizerPoint } from '../ResizerPoint/ResizerPoint'

export enum ResizerDirections {
  n = 'n',
  ne = 'ne',
  e = 'e',
  se = 'se',
  s = 's',
  sw = 'sw',
  w = 'w',
  nw = 'nw'
}

const directions = {
  canvas: [ResizerDirections.e, ResizerDirections.se, ResizerDirections.s],
  selection: [
    ResizerDirections.n,
    ResizerDirections.ne,
    ResizerDirections.e,
    ResizerDirections.se,
    ResizerDirections.s,
    ResizerDirections.sw,
    ResizerDirections.w,
    ResizerDirections.nw
  ]
}

export interface ResizerProps {
  top: number
  left: number
  width: number
  height: number
  hideBorderOnResizing?: boolean
  mode: 'canvas' | 'selection'
  onResizing?: (
    top: number,
    left: number,
    width: number,
    height: number
  ) => void
  onResizeEnd?: (
    top: number,
    left: number,
    width: number,
    height: number
  ) => void
}

export interface ResizerState {
  resizing: boolean
  resizeTop: number
  resizeLeft: number
  resizeWidth: number
  resizeHeight: number
}

export class Resizer extends PureComponent<ResizerProps, ResizerState> {
  resizeRect: RefObject<HTMLDivElement> = createRef()

  constructor(props: ResizerProps) {
    super(props)
    this.state = {
      resizing: false,
      resizeTop: this.props.top,
      resizeLeft: this.props.left,
      resizeWidth: this.props.width,
      resizeHeight: this.props.height
    }
  }

  render() {
    return (
      <div
        className={classNames('resizer', {
          resizer_resizing: this.state.resizing,
          'resizer_hide-border': this.props.hideBorderOnResizing
        })}
        ref={this.resizeRect}
        style={{
          width: `${
            this.state.resizing ? this.state.resizeWidth : this.props.width
          }px`,
          height: `${
            this.state.resizing ? this.state.resizeHeight : this.props.height
          }px`,
          top: `${
            this.state.resizing ? this.state.resizeTop : this.props.top
          }px`,
          left: `${
            this.state.resizing ? this.state.resizeLeft : this.props.left
          }px`
        }}>
        {directions[this.props.mode].map(d => (
          <ResizerPoint
            onResizeStart={e => this.onResizeStart()}
            onResizeMove={e => this.onResizeMove(d, e)}
            onResizeEnd={e => this.onResizeEnd()}
            onResizeCancel={e => this.onResizeCancel()}
            key={`${d}-resizer-point`}
            className={d}
          />
        ))}
      </div>
    )
  }

  onResizeStart() {}

  onResizeMove(direction: ResizerDirections, e: PointerEvent) {
    if (!this.resizeRect.current)
      throw new Error('The ref contains no rect element')
    let {
      top,
      left,
      bottom,
      right
    } = this.resizeRect.current.getBoundingClientRect()
    const parentRect = (this.resizeRect.current
      .parentNode as Element).getBoundingClientRect()
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
      case ResizerDirections.n:
        state.resizeTop = mouseY - parentRect.top
        state.resizeHeight = this.props.height - state.resizeTop
        break
      case ResizerDirections.ne:
        state.resizeTop = mouseY - parentRect.top
        state.resizeHeight = this.props.height - state.resizeTop
        state.resizeWidth = mouseX - left
        break
      case ResizerDirections.e:
        state.resizeWidth = mouseX - left
        break
      case ResizerDirections.se:
        state.resizeHeight = mouseY - top
        state.resizeWidth = mouseX - left
        break
      case ResizerDirections.s:
        state.resizeHeight = mouseY - top
        break
      case ResizerDirections.sw:
        state.resizeHeight = mouseY - top
        state.resizeLeft = mouseX - parentRect.left
        state.resizeWidth = this.props.width - state.resizeLeft
        break
      case ResizerDirections.w:
        state.resizeLeft = mouseX - parentRect.left
        state.resizeWidth = this.props.width - state.resizeLeft
        break
      case ResizerDirections.nw:
        state.resizeTop = mouseY - parentRect.top
        state.resizeHeight = this.props.height - state.resizeTop
        state.resizeLeft = mouseX - parentRect.left
        state.resizeWidth = this.props.width - state.resizeLeft
        break
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

  onResizeEnd() {
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

  onResizeCancel() {
    this.setState({
      resizing: false,
      resizeWidth: this.props.width,
      resizeHeight: this.props.height
    })
  }

  static getDerivedStateFromProps(
    nextProps: ResizerProps,
    prevState = { resizing: false }
  ) {
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
