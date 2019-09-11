import React, {
  PureComponent,
  createRef,
  RefObject,
  PointerEvent as ReactPointerEvent
} from 'react'

import { connect } from 'react-redux'

import { ZoneSelection } from './ZoneSelection/ZoneSelection'
import { ImageDataSelection } from './ImageDataSelection/ImageDataSelection'

import './SelectionInstrument.css'

import {
  changeImage,
  changeSelection,
  SelectionCoords,
  Color,
  Action,
  Instruments
} from '../../../actions'
import { StoreState } from '../../../reducers'
import { ThunkDispatch } from 'redux-thunk'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.

export interface SelectionInstrumentProps {
  imageData: ImageData
  selectionCoords?: SelectionCoords
  selectionImageData?: ImageData
  secondaryColor: Color
  changeSelection: (data: {
    coords?: SelectionCoords | null
    imageData?: ImageData | null
  }) => void
  changeImage: (imageData: ImageData) => void
}

export interface SelectionInstrumentState {
  selecting: boolean
  selectingX: number | null
  selectingY: number | null
  selectingCoords: SelectionCoords | null
  selectionOriginCoords: SelectionCoords | null
}

class _SelectionInstrument extends PureComponent<
  SelectionInstrumentProps,
  SelectionInstrumentState
> {
  containerRef: RefObject<HTMLDivElement> = createRef()

  backgroundColor: Color | null = null

  preventContextMenu: boolean = false

  constructor(props: SelectionInstrumentProps) {
    super(props)

    this.state = {
      selecting: false,
      selectingX: null,
      selectingY: null,
      selectingCoords: null,
      selectionOriginCoords: null
    }

    // todo - imageData selection handling
  }

  render() {
    let El
    if (this.state.selecting && this.state.selectingCoords) {
      El = (
        <div
          className="selecting"
          style={{
            top: `${this.state.selectingCoords.top}px`,
            left: `${this.state.selectingCoords.left}px`,
            width: `${this.state.selectingCoords.width}px`,
            height: `${this.state.selectingCoords.height}px`
          }}
        />
      )
    } else if (this.props.selectionImageData) {
      if (!this.props.selectionCoords)
        throw new Error('No selection coords were passed')
      El = (
        <ImageDataSelection
          onClickOutside={(e: ReactPointerEvent<HTMLCanvasElement>) =>
            this.handlePointerDown(e, true)
          }
          imageData={this.props.imageData}
          coords={this.props.selectionCoords}
          selectionImageData={this.props.selectionImageData}
          changeSelection={this.props.changeSelection}
          changeImage={(imageData: ImageData) =>
            this.props.changeImage(imageData)
          }
          secondaryColor={this.props.secondaryColor}
        />
      )
    } else if (this.props.selectionCoords) {
      El = (
        <ZoneSelection
          onClickOutside={e => this.handlePointerDown(e, true)}
          imageData={this.props.imageData}
          coords={this.props.selectionCoords}
          onCoordsChanged={(zone: SelectionCoords) =>
            this.props.changeSelection({ coords: zone })
          }
          onImageChanged={(imageData: ImageData) =>
            this.props.changeImage(imageData)
          }
          secondaryColor={this.props.secondaryColor}
        />
      )
    } else El = null
    return (
      <div
        className="selection"
        onPointerDown={this.handlePointerDown}
        ref={this.containerRef}>
        {El}
      </div>
    )
  }

  handlePointerDown = (
    e:
      | ReactPointerEvent<HTMLDivElement>
      | ReactPointerEvent<HTMLCanvasElement>
      | MouseEvent,
    trusted?: boolean
  ) => {
    if (e.target !== e.currentTarget) return

    this.props.changeSelection({})

    if (!this.containerRef.current) throw new Error("Couldn't get ref to div")

    let {
      top,
      left,
      bottom,
      right
    } = this.containerRef.current.getBoundingClientRect()
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
    ;[top, left] = [Math.ceil(mouseY - top), Math.ceil(mouseX - left)]
    this.setState({
      selecting: true,
      selectingY: top,
      selectingX: left,
      selectingCoords: null
    })
  }

  handleDocumentPointerMove = (e: PointerEvent) => {
    if (!this.state.selecting) return

    switch (e.buttons) {
      case 1:
        this.setState(state => {
          // getting bounding rect and mouse coords relatively to document, not viewport
          if (!this.containerRef.current)
            throw new Error("Couldn't get ref to div")
          let {
            top,
            left,
            bottom,
            right
          } = this.containerRef.current.getBoundingClientRect()
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

          // getting top and left coordinates of current mouse position relatively to canvas
          let [canvasRelativeTop, canvasRelativeLeft] = [
              Math.trunc(mouseY - top),
              Math.trunc(mouseX - left)
            ]
            // clamping top and left coordinates between 0 and canvas width
            //
          ;[canvasRelativeTop, canvasRelativeLeft] = [
            Math.max(
              0,
              Math.min(canvasRelativeTop, this.props.imageData.height)
            ),
            Math.max(
              0,
              Math.min(canvasRelativeLeft, this.props.imageData.width)
            )
          ]

          // console.log(canvasRelativeTop, canvasRelativeLeft)

          if (
            typeof state.selectingX !== 'number' ||
            typeof state.selectingY !== 'number'
          )
            throw new Error('No coordinates in the state')
          const selectingCoords = {
            top: Math.min(state.selectingY, canvasRelativeTop),
            left: Math.min(state.selectingX, canvasRelativeLeft),
            width: Math.max(
              Math.max(state.selectingX, canvasRelativeLeft) -
                Math.min(state.selectingX, canvasRelativeLeft),
              0
            ),
            height: Math.max(
              Math.max(state.selectingY, canvasRelativeTop) -
                Math.min(state.selectingY, canvasRelativeTop),
              0
            )
          }

          return {
            selectingCoords
          }
        })
        break
      case 2:
      case 3:
        this.setState({
          selecting: false,
          selectingX: null,
          selectingY: null,
          selectingCoords: null
        })
        this.preventContextMenu = true
        break // no default
    }
  }

  handleDocumentPointerUp = (e: PointerEvent) => {
    this.setState(state => {
      let selectionOriginCoords: SelectionCoords | null = null
      // also checking if user just clicked without moving (so there's no selectionCoords)
      // if (state.selecting && state.selectingCoords) {
      //   if (
      //     state.selectingCoords.width > 0 &&
      //     state.selectingCoords.height > 0
      //   ) {
      //     this.props.changeSelection({
      //       coords: state.selectingCoords,
      //       imageData: null
      //     })
      //     selectionOriginCoords = state.selectingCoords
      //   }
      //   return {
      //     selecting: false,
      //     selectingX: null,
      //     selectingY: null,
      //     selectingCoords: null,
      //     selectionOriginCoords
      //   }
      // } else {
      //   return {
      //     selecting: false,
      //     selectingX: null,
      //     selectingY: null
      //   }
      // }
      if (state.selecting && state.selectingCoords) {
        if (
          state.selectingCoords.width > 0 &&
          state.selectingCoords.height > 0
        ) {
          this.props.changeSelection({
            coords: state.selectingCoords,
            imageData: null
          })
          selectionOriginCoords = state.selectingCoords
        }
        return {
          selecting: false,
          selectingX: null,
          selectingY: null,
          selectingCoords: null,
          selectionOriginCoords
        }
      } else
        return {
          selecting: false,
          selectingX: null,
          selectingY: null,
          selectingCoords: state.selectingCoords,
          selectionOriginCoords: state.selectionOriginCoords
        }
    })
  }

  componentDidMount() {
    document.addEventListener('pointermove', this.handleDocumentPointerMove, {
      passive: true
    })
    document.addEventListener('pointerup', this.handleDocumentPointerUp, {
      passive: true
    })
    document.addEventListener('contextmenu', this.handleContextMenu)
  }

  componentWillUnmount() {
    document.removeEventListener('pointermove', this.handleDocumentPointerMove)
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

const mapStateToProps = (state: StoreState) => ({
  imageData: state.image.data,
  selectionCoords: state.instruments.instrument === Instruments.selection
    ? state.instruments.coords
    : undefined,
  selectionImageData: state.instruments.instrument === Instruments.selection
    ? state.instruments.selectionImageData
    : undefined,
  secondaryColor: state.colors.list[state.colors.secondary]
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeSelection: ({
    coords,
    imageData
  }: {
    coords?: SelectionCoords | null
    imageData?: ImageData | null
  }) => dispatch(changeSelection({ coords, imageData })),
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const SelectionInstrument = connect(
  mapStateToProps,
  mapDispatchToProps
)(_SelectionInstrument)
