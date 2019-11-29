import React, {
  PureComponent,
  createRef,
  RefObject,
  PointerEvent as ReactPointerEvent,
  FunctionComponent
} from 'react'

import { connect } from 'react-redux'

import './SelectionInstrument.css'

import {
  changeImage,
  changeInstrument,
  Color,
  Action,
  Instruments
} from '../../../actions'
import { StoreState } from '../../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { SelectionCoords, InstrumentStoreState } from '../../../reducers/instruments'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.

export interface SelectionInstrumentProps {
  originalImageData?: ImageData
  selectionImageData?: ImageData
  selectionCoords?: SelectionCoords
  secondaryColor: Color
  changeInstrument: (instrumentData: InstrumentStoreState) => void
  changeImage: (imageData: ImageData) => void
}

export interface SelectionInstrumentState {
  secondaryColor: Color,
  selecting: boolean,
  selectingStart?: { x: number, y: number }
}

class _SelectionInstrument extends PureComponent<SelectionInstrumentProps, SelectionInstrumentState> {
  constructor(props: SelectionInstrumentProps) {
    super(props)
    this.state = {
      secondaryColor: this.props.secondaryColor,
      selecting: false,
    }
  }
}

const mapStateToProps = (state: StoreState) => ({
  originalImageData: state.instruments.instrument === Instruments.selection ? state.instruments.originalImageData : undefined,
  selectionImageData: state.instruments.instrument === Instruments.selection ? state.instruments.selectionImageData : undefined,
  secondaryColor: state.colors.list[state.colors.secondary]
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  changeInstrument: (instrumentData: InstrumentStoreState) => dispatch(changeInstrument(instrumentData)),
  changeImage: (imageData: ImageData) => dispatch(changeImage(imageData))
})

export const SelectionInstrument = connect(mapStateToProps, mapDispatchToProps)(_SelectionInstrument)
