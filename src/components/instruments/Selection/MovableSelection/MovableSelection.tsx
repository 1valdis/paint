import { PureComponent, PointerEvent as ReactPointerEvent } from 'react'

import './MovableSelection.css'

import { Resizer } from '../../../Resizer/Resizer'
import { Rectangle } from '../../../../common/Rectangle'

export interface MovableSelectionProps {
  top: number
  left: number
  width: number
  height: number
  hideBorderOnResizing: boolean
  onResizeEnd?: (coords: Rectangle) => void
  onResizing?: (coords: Rectangle) => void
  onMoveEnd?: (coords: Rectangle) => void
  onMoving?: (coords: Rectangle) => void
}

export interface MovableSelectionState {
  moving: boolean
  startX: number | null
  startY: number | null
  left: number
  top: number
}

export class MovableSelection extends PureComponent<
  MovableSelectionProps,
  MovableSelectionState
> {
  preventContextMenu: boolean = false

  constructor (props: MovableSelectionProps) {
    super(props)
    this.state = {
      moving: false,
      startX: null,
      startY: null,
      left: this.props.left,
      top: this.props.top
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
    return (
      <div
        style={this.props}
        onPointerDown={this.handlePointerDown}
        className="movable-selection">
        <Resizer
          mode={'selection'}
          {...withoutOnChange}
          onResizing={this.onResizing}
          onResizeEnd={this.onResizeEnd}
          top={0}
          left={0}
        />
      </div>
    )
  }

  onResizeEnd = (top: number, left: number, width: number, height: number) => {
    this.props.onResizeEnd?.({
      top: this.props.top + top,
      left: this.props.left + left,
      width,
      height
    })
  }

  onResizing = (top: number, left: number, width: number, height: number) => {
    this.props.onResizing?.({
      top: this.props.top + top,
      left: this.props.left + left,
      width,
      height
    })
  }

  handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      this.setState({
        moving: true,
        startX: e.clientX + window.pageXOffset,
        startY: e.clientY + window.pageYOffset
      })
    }
  }

  handleDocumentPointerMove = (e: PointerEvent) => {
    if (
      this.state.moving &&
      this.state.startX !== null &&
      this.state.startY !== null &&
      this.props.onMoving
    ) {
      switch (e.buttons) {
        case 1: {
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
        }
        case 2:
        case 3:
          this.props.onMoving({
            top: this.state.top,
            left: this.state.left,
            width: this.props.width,
            height: this.props.height
          })
          this.setState({
            moving: false
          })
          this.preventContextMenu = true
          break
      }
    }
  }

  handleDocumentPointerUp = (e: PointerEvent) => {
    if (
      this.state.moving &&
      this.state.startX !== null &&
      this.state.startY !== null &&
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
      this.props.onMoveEnd?.(coords)
    }
    this.setState({
      moving: false,
      startX: null,
      startY: null
    })
  }

  static getDerivedStateFromProps = (
    props: MovableSelectionProps,
    state: MovableSelectionState
  ) => {
    if (!state.moving) {
      return {
        top: props.top,
        left: props.left
      }
    }
    return null
  }

  componentDidMount () {
    document.addEventListener('pointermove', this.handleDocumentPointerMove, {
      passive: true
    })
    document.addEventListener('pointerup', this.handleDocumentPointerUp, {
      passive: true
    })
    document.addEventListener('contextmenu', this.handleContextMenu)
  }

  componentWillUnmount () {
    document.removeEventListener('pointermove', this.handleDocumentPointerUp)
    document.removeEventListener('pointerup', this.handleDocumentPointerUp)
    document.removeEventListener('contextmenu', this.handleContextMenu)
  }

  handleContextMenu = (e: Event) => {
    if (this.preventContextMenu) {
      e.preventDefault()
      this.preventContextMenu = false
    }
  }
}
